import { Track } from './SpotifyApi';
import { shuffleArray, getNelementsFromArray, Observable, ChangeListener } from './util';
import * as Spotify from './SpotifyApi';

let api: Spotify.InitializedSpotifyApi;

//BUG this introduces temporal coupling. This is bad.
export function initializeNodes(spotifyApi: Spotify.InitializedSpotifyApi) {
  api = spotifyApi;
}

export abstract class PlaylistNode implements Observable {
  private changeListeners: ChangeListener[] = [];

  public abstract getTracks(): Track[];

  addChangeListener(changeListener: ChangeListener): void {
    this.changeListeners.push(changeListener);
  }

  removeChangeListener(changeListener: ChangeListener): void {
    var index = this.changeListeners.indexOf(changeListener, 0);
    if (index > -1) {
      this.changeListeners.splice(index, 1);
    }
  }

  fireChangeEvent(event?: any) {
    for(let changeListener of this.changeListeners) {
      changeListener.eventFired(event);
    }
  }

  public hasTrack(track: Track): boolean {
    return this.getTracks().some((thisTrack: Track) => {
      return thisTrack.equals(track);
    });
  }

  public abstract toJSON(): {type: string};

  public static fromJSON(json: {type: string}): Promise<PlaylistNode> {
    switch (json.type) {
      case SpotifyPlaylistNode.type: {
        return SpotifyPlaylistNode.fromJSON(json);
      }
      case AddNode.type: {
        return AddNode.fromJSON(json);
      }
      case SubtractNode.type: {
        return SubtractNode.fromJSON(json);
      }
      case TopTracksNode.type: {
        return TopTracksNode.fromJSON(json);
      }
    }
    throw new Error("Cannot deserialize json node.");
  }
}

abstract class IntermediatePlaylist extends PlaylistNode {
  private tracks: Track[] = [];

  constructor(tracks?: Track[]) {
    super();

    if(tracks) {
      this.tracks = tracks;
    }
  }

  addTrack(trackToAdd: Track): void {
    this.tracks.push(trackToAdd);
    this.fireChangeEvent();
  }

  //TODO: Test this method... after all the problems with the this.something BS...
  addTracks(tracksToAdd: Track[]): void {
    this.tracks = this.tracks.concat(tracksToAdd);
    this.fireChangeEvent();
  }

  public getTracks(): Track[] {
    return [...this.tracks]
  }
}

export class SpotifyPlaylistNode extends IntermediatePlaylist {
  private userId: string;
  private id: string;

  private constructor(tracks: Track[]) {
    super(tracks);
  }

  static get type(): string {
    return "SpotifyPlaylistNode";
  }

  public static async fromUserIdAndId(userId: string, id: string): Promise<SpotifyPlaylistNode> {
    return SpotifyPlaylistNode.from(await Spotify.Playlist.fromSpotifyUri(userId, id))
  }

  public static async from(spotifyPlaylist: Spotify.Playlist): Promise<SpotifyPlaylistNode> {
    console.debug(`Creating IntermediatePlaylist from Spotify playlist ${spotifyPlaylist.name}...`);
    let tracks = await spotifyPlaylist.tracks();
    console.debug(`Playlist has ${tracks.length} tracks.`)
    let playlist = new SpotifyPlaylistNode(tracks);
    playlist.id = spotifyPlaylist.id();
    playlist.userId = spotifyPlaylist.userId();
    return playlist;
  }

  toJSON(): any {
    return {
      type: SpotifyPlaylistNode.type,
      userId: this.userId,
      id: this.id
    }
  }

  public static async fromJSON(json: any): Promise<SpotifyPlaylistNode> {
    return await SpotifyPlaylistNode.fromUserIdAndId(json.userId, json.id);
  }
}

export class AddNode extends IntermediatePlaylist {
  private playlists: {playlist: PlaylistNode, songCount: number}[];
  private randomSelection: boolean;

  constructor(playlists: {playlist: PlaylistNode, songCount: number}[], randomSelection: boolean) {
    super();

    this.playlists = [...playlists];
    this.randomSelection = randomSelection;

    this.initialize();
  }

  private initialize() {
    for(let playlistCount of this.playlists) {
      this.addTracks(
        this.getTracksFromPlaylist(playlistCount.playlist, playlistCount.songCount)
      );
    }
    console.debug(`Initialized AddNode. Node has ${this.getTracks().length} tracks.`);
  }

  private getTracksFromPlaylist(playlist: PlaylistNode, songCount: number): Track[] {
    let tracks = playlist.getTracks();
    console.debug(`Playlist ${playlist} has ${tracks.length} tracks. Getting ${songCount} tracks from playlist...`);
    return getNelementsFromArray(songCount, tracks, this.randomSelection);
  }

  static get type(): string {
    return "AddNode";
  }

  toJSON() {
    let playlists: any[] = [];
    for(let playlist of this.playlists) {
      playlists.push({playlist: playlist.playlist.toJSON(), songCount: playlist.songCount});
    }

    return {
      type: AddNode.type,
      randomSelection: this.randomSelection,
      playlists
    }
  }

  public static async fromJSON(json: any): Promise<AddNode> {
    let playlists: {playlist: PlaylistNode, songCount: number}[] = [];

    for(let rawPlaylist of json.playlists) {
      playlists.push({
        playlist: await PlaylistNode.fromJSON(rawPlaylist.playlist),
        songCount: rawPlaylist.songCount
      });
    }

    return new AddNode(playlists, json.randomSelection);
  }
}

export class SubtractNode extends IntermediatePlaylist {
  private minuend: PlaylistNode;
  private subtrahend: PlaylistNode;

  constructor(minuend: PlaylistNode, subtrahend: PlaylistNode) {
    super();
    this.minuend = minuend;
    this.subtrahend = subtrahend;
    this.initialize();
  }

  static get type(): string {
    return "SubtractNode";
  }

  private initialize() {
    let tracks = this.minuend.getTracks();
    tracks = tracks.filter((track: Track) => !this.subtrahend.hasTrack(track));

    this.addTracks(tracks);
  }

  toJSON() {
    return {
      type: SubtractNode.type,
      minuend: this.minuend.toJSON(),
      subtrahend: this.subtrahend.toJSON()
    }
  }

  static async fromJSON(json: any): Promise<SubtractNode> {
    let minuend = PlaylistNode.fromJSON(json.minuend);
    let subtrahend = PlaylistNode.fromJSON(json.subtrahend);
    return new SubtractNode(await minuend, await subtrahend);
  }
}

export class TopTracksNode extends IntermediatePlaylist {
  private timeRange: Spotify.TimeRanges;

  public static async createNew(timeRange: Spotify.TimeRanges): Promise<TopTracksNode> {
    let node = new TopTracksNode(timeRange);
    await node.initialize();
    return node;
  }

  private constructor(timeRange) {
    super();
    this.timeRange = timeRange;
  }

  static get type(): string {
    return "TopTracksNode";
  }

  private async initialize() {
    let tracks = await api.getMyTopTracks(this.timeRange);
    this.addTracks(tracks);
  }

  toJSON() {
    return {
      type: TopTracksNode.type,
      timeRange: this.timeRange
    }
  }

  static async fromJSON(json: any): Promise<TopTracksNode> {
    return await TopTracksNode.createNew(json.timeRange);
  }
}
