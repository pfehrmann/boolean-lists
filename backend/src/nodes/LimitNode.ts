import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {IntermediatePlaylist} from "./IntermediatePlaylist";
import {PlaylistNode} from "./Nodes";

export class LimitNode extends IntermediatePlaylist {
    static get type(): string {
        return "LimitNode";
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<LimitNode> {
        const inPlaylist = PlaylistNode.fromJSON(api, json.inPlaylist);
        const limit = json.limit;
        return new LimitNode(await inPlaylist, limit);
    }

    private inPlaylist: PlaylistNode;
    private limit: number;

    constructor(inPlaylist: PlaylistNode, limit: number) {
        super();
        this.inPlaylist = inPlaylist;
        this.limit = limit;
        this.initialize();
    }

    public toJSON() {
        return {
            inPlaylist: this.inPlaylist.toJSON(),
            limit: this.limit,
            type: LimitNode.type,
        };
    }

    private initialize() {
        let tracks = this.inPlaylist.getTracks();
        tracks = tracks.slice(0, this.limit);

        this.addTracks(tracks);
    }
}
