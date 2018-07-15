import { Track } from './SpotifyApi';
import { shuffleArray, getNelementsFromArray, Observable, ChangeListener } from './util';
import * as Spotify from './SpotifyApi';

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
}

export class IntermediatePlaylist extends PlaylistNode {
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

  public static async from(spotifyPlaylist: Spotify.Playlist) {
    console.debug(`Creating IntermediatePlaylist from Spotify playlist ${spotifyPlaylist.name}...`);
    let tracks = await spotifyPlaylist.tracks();
    console.debug(`Playlist has ${tracks.length} tracks.`)
    return new IntermediatePlaylist(tracks);
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
}
