import * as logger from "winston";
import {Album} from "../spotify/Album";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {IntermediatePlaylist} from "./IntermediatePlaylist";

export class AlbumNode extends IntermediatePlaylist {

    static get type(): string {
        return "AlbumNode";
    }

    public static async fromId(api: InitializedSpotifyApi,
                               id: string): Promise<AlbumNode> {
        return AlbumNode.from(await Album.fromSpotifyUri(api, id));
    }

    public static async from(album: Album): Promise<AlbumNode> {
        logger.debug(`Creating IntermediatePlaylist from album ${album.name()}...`);
        const tracks = await album.tracks();
        logger.debug(`Album has ${tracks.length} tracks.`);
        const albumNode = new AlbumNode(tracks);
        albumNode.id = album.id();
        return albumNode;
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<AlbumNode> {
        return await AlbumNode.fromId(api, json.id);
    }

    private id: string;

    private constructor(tracks: Track[]) {
        super(tracks);
    }

    public toJSON(): any {
        return {
            id: this.id,
            type: AlbumNode.type,
        };
    }
}
