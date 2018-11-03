import {shuffleArray} from "../../util";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {IntermediatePlaylist} from "./IntermediatePlaylist";
import {fromJSON} from "./JsonParser";
import {PlaylistNode} from "./Nodes";

export class RandomizeNode extends IntermediatePlaylist {
    static get type(): string {
        return "RandomizeNode";
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<RandomizeNode> {
        const inPlaylist = fromJSON(api, json.inPlaylist);
        return new RandomizeNode(await inPlaylist);
    }

    private inPlaylist: PlaylistNode;

    constructor(inPlaylist: PlaylistNode) {
        super();
        this.inPlaylist = inPlaylist;
        this.initialize();
    }

    public toJSON() {
        return {
            inPlaylist: this.inPlaylist.toJSON(),
            type: RandomizeNode.type,
        };
    }

    private initialize() {
        let tracks = this.inPlaylist.getTracks();
        tracks = shuffleArray(tracks);
        this.addTracks(tracks);
    }
}
