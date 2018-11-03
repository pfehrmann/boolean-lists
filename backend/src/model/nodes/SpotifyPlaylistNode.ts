import * as logger from "winston";
import {Playlist} from "../spotify/Playlist";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {IntermediatePlaylist} from "./IntermediatePlaylist";

export class SpotifyPlaylistNode extends IntermediatePlaylist {

    static get type(): string {
        return "SpotifyPlaylistNode";
    }

    public static async fromUserIdAndId(api: InitializedSpotifyApi,
                                        userId: string,
                                        id: string): Promise<SpotifyPlaylistNode> {
        return SpotifyPlaylistNode.from(await Playlist.fromSpotifyUri(api, userId, id));
    }

    public static async from(spotifyPlaylist: Playlist): Promise<SpotifyPlaylistNode> {
        logger.debug(`Creating IntermediatePlaylist from Spotify playlist ${spotifyPlaylist.name}...`);
        const tracks = await spotifyPlaylist.tracks();
        logger.debug(`Playlist has ${tracks.length} tracks.`);
        const playlist = new SpotifyPlaylistNode(tracks);
        playlist.id = spotifyPlaylist.id();
        playlist.userId = spotifyPlaylist.userId();
        return playlist;
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<SpotifyPlaylistNode> {
        return await SpotifyPlaylistNode.fromUserIdAndId(api, json.userId, json.id);
    }

    private userId: string;
    private id: string;

    private constructor(tracks: Track[]) {
        super(tracks);
    }

    public toJSON(): any {
        return {
            id: this.id,
            type: SpotifyPlaylistNode.type,
            userId: this.userId,
        };
    }
}
