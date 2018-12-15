import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {IntermediatePlaylist} from "./IntermediatePlaylist";

export class LibraryNode extends IntermediatePlaylist {

    static get type(): string {
        return "LibraryNode";
    }

    public static async createNew(api: InitializedSpotifyApi): Promise<LibraryNode> {
        const node = new LibraryNode();
        await node.initialize(api);
        return node;
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<LibraryNode> {
        return await LibraryNode.createNew(api);
    }

    private constructor() {
        super();
    }

    public toJSON() {
        return {
            type: LibraryNode.type,
        };
    }

    private async initialize(api: InitializedSpotifyApi) {
        const tracks = await api.getMyLibrary();
        this.addTracks(tracks);
    }
}
