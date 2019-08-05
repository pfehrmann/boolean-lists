import * as logger from "winston";
import {sleep} from "../../util";
import {InitializedSpotifyApi} from "./SpotifyApi";
import {Track} from "./Track";
const Cache = require("async-disk-cache");

const artistCache = new Cache("artist-cache");

export class Artist {
    public static async fromSpotifyUri(api: InitializedSpotifyApi, id: string): Promise<Artist> {
        const response = await api.spotifyApi.getArtist(id);
        await sleep(10);
        return new Artist(api, response.body);
    }

    private api: InitializedSpotifyApi;
    private artist: any;

    constructor(api: InitializedSpotifyApi, artist: any) {
        this.api = api;
        this.artist = artist;
    }

    public name(): string {
        return this.artist.name;
    }

    public id(): string {
        return this.artist.id;
    }

    public image() {
        if (!this.artist.images[0]) {
            return {};
        }
        return {
            height: this.artist.images[0].height,
            url: this.artist.images[0].url,
            width: this.artist.images[0].width,
        };
    }

    public async topTracks(): Promise<Track[]> {
        if (!await artistCache.has(this.id())) {
            logger.debug(`Fetching top tracks for artist ${this.id()} (${this.name()})`);
            let rawTracks;
            let tracks;
            try {
                rawTracks = await this.api.spotifyApi.getArtistTopTracks(this.id(), "DE");
                tracks = rawTracks.body.tracks.map((rawTrack) => new Track(rawTrack, this.api));
                await this.setTopTracks(tracks);
            } catch (e) {
                logger.info(`Failed to load top tracks of artist with id ${this.id()} from API`);
                logger.error(e);
            }
            return tracks;
        }

        logger.debug(`Using cached songs for artist ${this.id()}`);
        const cacheResponse = await artistCache.get(this.id());
        try {
            const values = JSON.parse(cacheResponse.value);
            return values.map((value: any) => new Track(value.track, this.api));
        } catch (e) {
            logger.info(`Failed to load top tracks of artist with id ${this.id()}`);
            logger.error(e);
        }
    }

    private async setTopTracks(tracks: Track[]) {
        await artistCache.set(this.id(), JSON.stringify(tracks));
    }
}
