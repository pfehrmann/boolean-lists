import {Playlist} from "./Playlist";
import {InitializedSpotifyApi} from "./SpotifyApi";

export class User {
    private user: Promise<any>;
    private cachedPlaylists: Playlist[];
    private cachedId;
    private api: InitializedSpotifyApi;

    constructor(api: InitializedSpotifyApi, user: any) {
        this.api = api;
        this.user = user;
    }

    public async id(): Promise<string> {
        if (!this.cachedId) {
            this.cachedId = (await this.user).body.id as string;
        }
        return this.cachedId;
    }

    public async createPlaylist(playlistName: string, options: any = {public: false}): Promise<Playlist> {
        const response = await this.api.createPlaylist(await this.id(), playlistName, options);
        return new Playlist(this.api, response.body);
    }

    public async playlist(name: string): Promise<Playlist> {
        // BUG this is a very bad idea, if a playlist name is existing twice...

        // make sure, the local copy is available
        await this.playlists();

        // search local copy
        if (this.cachedPlaylists) {
            for (const playlist of this.cachedPlaylists) {
                if (await playlist.name() === name) {
                    return playlist;
                }
            }
        }
    }

    public async playlists(): Promise<Playlist[]> {
        if (!this.cachedPlaylists) {
            this.cachedPlaylists = await this.api.getAllUserPlaylists(await this.id());
        }
        return [...this.cachedPlaylists];
    }
}
