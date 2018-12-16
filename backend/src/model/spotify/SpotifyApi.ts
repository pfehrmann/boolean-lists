import * as wrapper from "./SpotifyWebApiWrapper";
wrapper.test();

import * as DataLoader from "dataloader";
import * as SpotifyWebApi from "spotify-web-api-node";
import {getAll} from "../../util";
import {Album} from "./Album";
import {AudioFeatures} from "./AudioFeatures";
import {Playlist} from "./Playlist";
import {Track} from "./Track";
import {User} from "./User";

import * as _ from "lodash";
import * as logger from "winston";

export enum TimeRanges {
    LONG = "long_term",
    MEDIUM = "medium_term",
    SHORT = "short_term",
}

export class InitializedSpotifyApi {
    public spotifyApi: SpotifyWebApi;

    private audioFeaturesLoader = new DataLoader((uris: string[]) => this.getAudioFeatures(uris), {
        maxBatchSize: 100,
    });

    constructor(spotifyApi: any) {
        this.spotifyApi = spotifyApi;
    }

    public async me(): Promise<User> {
        return new User(this, this.spotifyApi.getMe());
    }

    public async createPlaylist(id: any, playlistName: string, options: any): Promise<any> {
        return await this.spotifyApi.createPlaylist(id, playlistName, options);
    }

    public async getMyTopTracks(timeRange: TimeRanges): Promise<Track[]> {
        const tracks: Track[] = [];
        const rawTracks = await this.spotifyApi.getMyTopTracks({time_range: timeRange, limit: 50});
        for (const rawTrack of rawTracks.body.items) {
            tracks.push(new Track(rawTrack, this));
        }
        return tracks;
    }

    public async getMyLibrary(): Promise<Track[]> {
        return await getAll<Track>(this.spotifyApi,
            this.spotifyApi.getMySavedTracks,
            (i) => new Track(i, this),
            [],
            {offset: 0, limit: 50});
    }

    public async searchForPlaylists(query: string, options: { market?: string, limit?: number, offset?: number } = {
        limit: 20,
        offset: 0,
    }): Promise<Playlist[]> {
        logger.info(`Searching for playlists with query '${query}'`);
        const rawPlaylists = await this.spotifyApi.searchPlaylists(query, options);
        logger.info(`Found some playlists. Mapping to correct objects...`);
        return rawPlaylists.body.playlists.items.map((item: any) => new Playlist(this, item));
    }

    public async searchForAlbums(query: string, options: { market?: string, limit?: number, offset?: number } = {
        limit: 20,
        offset: 0,
    }): Promise<Album[]> {
        const rawAlbums = await this.spotifyApi.searchAlbums(query, options);
        return rawAlbums.body.albums.items.map((item: any) => new Album(this, item));
    }

    /**
     * Get all playlists for a specific user
     * @param id The id of the user
     */
    public async getAllUserPlaylists(id: any) {
        return await getAll<Playlist>(this.spotifyApi,
            this.spotifyApi.getUserPlaylists,
            (i) => new Playlist(this, i),
            [id]);
    }

    public async getAudioFeature(id: string): Promise<AudioFeatures> {
        return await this.audioFeaturesLoader.load(id);
    }

    private async getAudioFeatures(ids: string[]): Promise<AudioFeatures[]> {
        logger.info(`Getting ${ids.length} tracks audio features`);
        const trimmedIds = ids.map((id) => {
            const tokens = id.split(":");
            return tokens[tokens.length - 1];
        });
        const idLists: string[][] = [];
        for (let i = 0; i < trimmedIds.length; i += 100) {
            idLists.push(trimmedIds.slice(i, i + 100));
        }

        const rawAudioFeaturesPromises = await idLists.map(async (idList) => {
            return this.spotifyApi.getAudioFeaturesForTracks(idList);
        });

        const rawAudioFeatures = await Promise.all(rawAudioFeaturesPromises);

        const flatRawAudioFeatures = _.flatten(rawAudioFeatures.map((rawFeatures: any) => {
            return rawFeatures.body.audio_features;
        }));

        return await flatRawAudioFeatures.map((rawFeatures: any) => {
            return new AudioFeatures(rawFeatures);
        });
    }
}
