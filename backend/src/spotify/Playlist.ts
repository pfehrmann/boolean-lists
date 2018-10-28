import * as logger from "winston";
import {sleep} from "../util";
import {getAll} from "../util";
import {InitializedSpotifyApi} from "./SpotifyApi";
import {Track} from "./Track";
const Cache = require("async-disk-cache");

const playlistCache = new Cache("playlist-cache");

export class Playlist {
    public static async fromSpotifyUri(api: InitializedSpotifyApi, username: string, id: string): Promise<Playlist> {
        const key = JSON.stringify({username, id});
        if (! await playlistCache.has(key)) {
            const response = await api.spotifyApi.getPlaylist(username, id);
            const playlist = new Playlist(api, response.body);
            playlistCache.set(key, JSON.stringify(response.body));
            return playlist;
        } else {
            return new Playlist(api, JSON.parse((await playlistCache.get(key)).value));
        }
    }

    private api: InitializedSpotifyApi;
    private playlist: any;

    constructor(api: InitializedSpotifyApi, playlist: any) {
        this.api = api;
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

    public image() {
        return {
            height: this.playlist.images[0].height,
            url: this.playlist.images[0].url,
            width: this.playlist.images[0].width,
        };
    }

    public async addTracks(tracks: Track[]) {
        while (tracks.length > 0) {
            logger.info(`${tracks.length} tracks left...`);
            const toAdd = tracks.slice(0, 100);
            tracks = tracks.slice(100);
            const uris: string[] = toAdd.map((track: Track) => track.uri());
            for (let i = 0; i < 3; i++) {
                if (i > 0) {
                    await sleep();
                }
                let response;
                try {
                    response = await this.api.spotifyApi
                        .addTracksToPlaylist(this.playlist.owner.id, this.playlist.id, uris);
                    const allTracks = (await this.tracks()).concat(toAdd);
                    await this.setTracks(allTracks);
                    break;
                } catch (err) {
                    logger.error(`Failed to add tracks to playlist. Remaining tracks: ${tracks.length + toAdd.length}`);
                    logger.error(err);
                    logger.error(response);
                }
            }
        }
    }

    public async clear() {
        let tracks = await this.tracks();
        while (tracks.length > 0) {
            logger.info(`${tracks.length} tracks left to delete...`);
            const toRemove = tracks.slice(0, 100);
            tracks = tracks.slice(100);
            const uris = toRemove.map((track: Track) => {
                return {
                    uri: track.uri(),
                };
            });
            for (let i = 0; i < 3; i++) {
                if (i > 0) {
                    await sleep();
                }
                let response;
                try {
                    response = await this.api.spotifyApi
                        .removeTracksFromPlaylist(this.playlist.owner.id, this.playlist.id, uris);
                    await this.setTracks(tracks);
                    break;
                } catch (err) {
                    logger.error(`Failed to add tracks to playlist. Remaining tracks: ${tracks.length}`);
                    logger.error(err);
                    logger.error(response);
                }
            }
        }
        await playlistCache.remove(this.playlist.id);
    }

    public async tracks(): Promise<Track[]> {
        if (!await playlistCache.has(this.playlist.id)) {
            const tracks = await getAll<Track>(this.api.spotifyApi,
                this.api.spotifyApi.getPlaylistTracks,
                (e) => new Track(e),
                [this.playlist.owner.id, this.playlist.id]);
            await this.setTracks(tracks);
        }
        const cacheResponse = await playlistCache.get(this.playlist.id);
        try {
            const values = JSON.parse(cacheResponse.value);
            return values.map((value: any) => new Track(value.track));
        } catch (e) {
            logger.info(`Failed to load playlist with id ${this.playlist.id}`);
            logger.error(e);
        }
    }

    private async setTracks(tracks: Track[]) {
        await playlistCache.set(this.playlist.id, JSON.stringify(tracks));
    }
}
