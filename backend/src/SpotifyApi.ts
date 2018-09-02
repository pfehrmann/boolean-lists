let SpotifyWebApi = require('spotify-web-api-node');
let opn = require('opn');
let express = require('express');
import { Request, Response, NextFunction } from 'express';
let Cache = require('async-disk-cache');
import { sleep } from './util';

let playlistCache = new Cache('playlist-cache');
let userCache = new Cache('user-cache');
let trackCache = new Cache('track-cache');

var spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URI,
});

let initializedSpotifyApi;

let sleepDelay = 50;

export function initialize(): Promise<InitializedSpotifyApi> {
    if(initializedSpotifyApi) {
        return new Promise((resolve: any, reject: any) => {
            resolve(initializedSpotifyApi);
        })
    }

    return new Promise((resolve: any, reject: any) => {
        let scopes = ['user-read-private', 'playlist-read-private', 'playlist-modify-public', 'playlist-modify-private', 'user-top-read'];
        let state = 'random-state'

        let authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

        opn(authorizeURL);

        let server: any;
        let app = express();
        app.get('/auth/spotify/callback', (req: Request, res: Response, next: NextFunction) => {
            spotifyApi.setAccessToken(req.query.code);
            spotifyApi.authorizationCodeGrant(req.query.code).then((data: any) => {

                // Set the access token on the API object to use it in later calls
                spotifyApi.setAccessToken(data.body['access_token']);
                spotifyApi.setRefreshToken(data.body['refresh_token']);

                initializedSpotifyApi = new InitializedSpotifyApi();
                resolve(initializedSpotifyApi);
            }).catch((error: any) => {
                reject(error);
            });
            res.end("<script>window.close()</script>");
            server.close();
        });

        server = app.listen(8080, () => {
            console.log("Listening on port 8080");
        });
    });
}

export enum TimeRanges {
  LONG = "long_term",
  MEDIUM = "medium_term",
  SHORT = "short_term"
}

export class InitializedSpotifyApi {
    constructor() {
    }

    public async me(): Promise<User> {
        return new User(spotifyApi.getMe());
    }

    public async getMyTopTracks(timeRange: TimeRanges): Promise<Track[]> {
      let tracks: Track[] = [];
      let rawTracks = await spotifyApi.getMyTopTracks({time_range: timeRange, limit: 50});
      for(let rawTrack of rawTracks.body.items) {
        tracks.push(new Track(rawTrack));
      }
      return tracks;
    }

    public async searchForPlaylists(name: string): Promise<Playlist[]> {
        let rawPlaylists = await spotifyApi.searchPlaylists(name);
        return rawPlaylists.body.playlists.items.map((item: any) => new Playlist(item));
    }
}

export class User {
    private user: Promise<any>;
    private cachedPlaylists: Playlist[];
    private cachedId;

    constructor(user: any) {
        this.user = user;
    }

    public async id(): Promise<string> {
        if (!this.cachedId) {
            this.cachedId = (await this.user).body.id as string;
        }
        return this.cachedId;
    }

    public async createPlaylist(playlistName: string, options: any = { public: false }): Promise<Playlist> {
        let response = await spotifyApi.createPlaylist(await this.id(), playlistName, options);
        return new Playlist(response.body);
    }

    public async playlist(name: string): Promise<Playlist> {
        // BUG this is a very bad idea, if a playlist name is existing twice...

        // make sure, the local copy is available
        await this.playlists();

        // search local copy
        if (this.cachedPlaylists) {
            for (let playlist of this.cachedPlaylists) {
                if (await playlist.name() == name) {
                    return playlist;
                }
            }
        }
    }

    public async playlists(): Promise<Playlist[]> {
        if (!this.cachedPlaylists) {
            this.cachedPlaylists = await getAll<Playlist>(spotifyApi.getUserPlaylists, (i) => new Playlist(i), [await this.id()]);
        }
        return [...this.cachedPlaylists];
    }
}

async function getAll<T>(spotifyFunction: (...args: any[]) => Promise<any>, constructor: (item: any) => T, args: any[], options: any = { offset: 0 }, ) {
    let completeArgs = [...args];
    completeArgs.push(options);

    let result = await spotifyFunction.apply(spotifyApi, completeArgs);
    let items: T[] = result.body.items.map((item: any) => constructor(item));

    if (result.body.next) {
        await sleep(sleepDelay);
        return items.concat(await getAll(spotifyFunction, constructor, args, { offset: result.body.items.length + options.offset }));
    }
    return items;
}

export class Playlist {
    private playlist: any;

    constructor(playlist: any) {
        this.playlist = playlist;
    }

    public name(): string {
        return this.playlist.name;
    }

    public userId(): string {
        return this.playlist.owner.id;
    }

    public id(): string {
      return this.playlist.id;
    }

    public async addTracks(tracks: Track[]) {
        while (tracks.length > 0) {
            console.log(`${tracks.length} tracks left...`);
            let toAdd = tracks.slice(0, 100);
            tracks = tracks.slice(100);
            let uris: string[] = toAdd.map((track: Track) => track.uri());
            for (let i = 0; i < 3; i++) {
                if(i > 0) {
                    await sleep(sleepDelay);
                }
                try {
                    await spotifyApi.addTracksToPlaylist(this.playlist.owner.id, this.playlist.id, uris);
                    let allTracks = (await this.tracks()).concat(toAdd);
                    this.setTracks(allTracks);
                    break;
                } catch (err) {
                    console.error(`Failed to add tracks to playlist. Remaining tracks: ${tracks.length + toAdd.length}`);
                    console.error(err);
                }
            }
        }
    }

    public async addTracks(tracks: Track[]) {
        while (tracks.length > 0) {
            console.log(`${tracks.length} tracks left...`);
            let toAdd = tracks.slice(0, 100);
            tracks = tracks.slice(100);
            let uris: string[] = toAdd.map((track: Track) => track.uri());
            for (let i = 0; i < 3; i++) {
                if(i > 0) {
                    await sleep(sleepDelay);
                }
                let response;
                try {
                    response = await spotifyApi.addTracksToPlaylist(this.playlist.owner.id, this.playlist.id, uris);
                    let allTracks = (await this.tracks()).concat(toAdd);
                    this.setTracks(allTracks);
                    break;
                } catch (err) {
                    console.error(`Failed to add tracks to playlist. Remaining tracks: ${tracks.length + toAdd.length}`);
                    console.error(err);
                    console.error(response);
                }
            }
        }
    }

    private async setTracks(tracks: Track[]) {
        await playlistCache.set(this.playlist.id, JSON.stringify(tracks));
    }

    public async tracks(): Promise<Track[]> {
        if (!await playlistCache.has(this.playlist.id)) {
            let tracks = await getAll<Track>(spotifyApi.getPlaylistTracks, (e) => new Track(e), [this.playlist.owner.id, this.playlist.id]);
            await this.setTracks(tracks);
        }
        let cacheResponse = await playlistCache.get(this.playlist.id);
        try {
            let values = JSON.parse(cacheResponse.value);
            return values.map((value: any) => new Track(value.track));
        } catch (e) {
            console.log(`Failed to load playlist with id ${this.playlist.id}`);
            console.log(e);
        }
    }

    public static async fromSpotifyUri(username: string, id: string): Promise<Playlist> {
      let response = await spotifyApi.getPlaylist(username, id);
      await sleep(10);
      return new Playlist(response.body);
    }
}

export class Track {
    private track: any;
    constructor(track: any) {
        this.track = track;

        let times = 0;
        while(!this.track.uri && times++ < 5) {
          this.track = this.track.track;
        }
        
        if(times >= 5) {
          throw new Error("Could not instanciate Track, uri was not found.");
        }
    }

    public uri() {
        return this.track.uri;
    }

    public equals(object: Track): boolean {
      return this.uri() === object.uri();
    }
}
