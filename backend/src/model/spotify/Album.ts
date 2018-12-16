import * as logger from "winston";
import {sleep} from "../../util";
import {getAll} from "../../util";
import {Artist} from "./Artist";
import {InitializedSpotifyApi} from "./SpotifyApi";
import {Track} from "./Track";
const Cache = require("async-disk-cache");

const albumCache = new Cache("album-cache");

export class Album {
    public static async fromSpotifyUri(api: InitializedSpotifyApi, id: string): Promise<Album> {
        const response = await api.spotifyApi.getAlbum(id);
        await sleep(10);
        return new Album(api, response.body);
    }

    private api: InitializedSpotifyApi;
    private album: any;

    constructor(api: InitializedSpotifyApi, album: any) {
        this.api = api;
        this.album = album;
    }

    public name(): string {
        return this.album.name;
    }

    public id(): string {
        return this.album.id;
    }

    public image() {
        return {
            height: this.album.images[0].height,
            url: this.album.images[0].url,
            width: this.album.images[0].width,
        };
    }

    public artists(): Artist[] {
        const artists: Artist[] = [];
        for (const rawArtist of this.album.artists) {
            artists.push(new Artist(this.api, rawArtist));
        }
        return artists;
    }

    public async tracks(): Promise<Track[]> {
        if (!await albumCache.has(this.album.id)) {
            logger.debug(`Fetching songs for album ${this.album.id}`);
            const tracks = await getAll<Track>(this.api.spotifyApi,
                this.api.spotifyApi.getAlbumTracks,
                (e) => new Track(e, this.api),
                [this.album.id]);
            await this.setTracks(tracks);
            return tracks;
        }

        logger.debug(`Using cached songs for album ${this.album.id}`);
        const cacheResponse = await albumCache.get(this.album.id);
        try {
            const values = JSON.parse(cacheResponse.value);
            return values.map((value: any) => new Track(value.track, this.api));
        } catch (e) {
            logger.info(`Failed to load playlist with id ${this.album.id}`);
            logger.error(e);
        }
    }

    private async setTracks(tracks: Track[]) {
        await albumCache.set(this.album.id, JSON.stringify(tracks));
    }
}
