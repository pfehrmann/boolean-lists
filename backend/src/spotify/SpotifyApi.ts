import {getAll} from "../util";
import {Album} from "./Album";
import {Playlist} from "./Playlist";
import {Track} from "./Track";
import {User} from "./User";

export enum TimeRanges {
    LONG = "long_term",
    MEDIUM = "medium_term",
    SHORT = "short_term",
}

export class InitializedSpotifyApi {
    public spotifyApi: any;

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
            tracks.push(new Track(rawTrack));
        }
        return tracks;
    }

    public async searchForPlaylists(query: string, options: { market?: string, limit?: number, offset?: number } = {
        limit: 20,
        offset: 0,
    }): Promise<Playlist[]> {
        const rawPlaylists = await this.spotifyApi.searchPlaylists(query, options);
        return rawPlaylists.body.playlists.items.map((item: any) => new Playlist(this, item));
    }

    public async searchForAlbums(query: string, options: { market?: string, limit?: number, offset?: number } = {
        limit: 20,
        offset: 0,
    }): Promise<Album[]> {
        const rawAlbums = await this.spotifyApi.searchAlbums(query, options);
        return rawAlbums.body.albums.items.map((item: any) => new Album(this, item));
    }

    public async getAllUserPlaylists(id: any) {
        return await getAll<Playlist>(this.spotifyApi,
            this.spotifyApi.getUserPlaylists,
            (i) => new Playlist(this, i),
            [id]);
    }
}
