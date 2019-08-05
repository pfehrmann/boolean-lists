import * as logger from "winston";
import {Artist} from "../spotify/Artist";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {IntermediatePlaylist} from "./IntermediatePlaylist";

export class ArtistTopTracksNode extends IntermediatePlaylist {

    static get type(): string {
        return "ArtistTopTracksNode";
    }

    public static async fromId(api: InitializedSpotifyApi,
                               id: string): Promise<ArtistTopTracksNode> {
        return ArtistTopTracksNode.from(await Artist.fromSpotifyUri(api, id));
    }

    public static async from(artist: Artist): Promise<ArtistTopTracksNode> {
        logger.debug(`Creating IntermediatePlaylist from artists top tracks ${artist.name()}...`);
        const tracks = await artist.topTracks();
        const artistTopTrackNode = new ArtistTopTracksNode(tracks);
        artistTopTrackNode.id = artist.id();
        return artistTopTrackNode;
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<ArtistTopTracksNode> {
        return await ArtistTopTracksNode.fromId(api, json.id);
    }

    private id: string;

    private constructor(tracks: Track[]) {
        super(tracks);
    }

    public toJSON(): any {
        return {
            id: this.id,
            type: ArtistTopTracksNode.type,
        };
    }
}
