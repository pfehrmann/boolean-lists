import {sleep} from "../../util";
import {InitializedSpotifyApi} from "./SpotifyApi";

export class Artist {
    public static async fromSpotifyUri(api: InitializedSpotifyApi, username: string, id: string): Promise<Artist> {
        const response = await api.spotifyApi.getArtist(username, id);
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
}
