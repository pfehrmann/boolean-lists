import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {IntermediatePlaylist} from "./IntermediatePlaylist";
import {fromJSON} from "./JsonParser";
import {PlaylistNode} from "./Nodes";

export class SubtractNode extends IntermediatePlaylist {

    static get type(): string {
        return "SubtractNode";
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<SubtractNode> {
        const minuend = fromJSON(api, json.minuend);
        const subtrahend = fromJSON(api, json.subtrahend);
        return new SubtractNode(await minuend, await subtrahend);
    }

    private minuend: PlaylistNode;
    private subtrahend: PlaylistNode;

    constructor(minuend: PlaylistNode, subtrahend: PlaylistNode) {
        super();
        this.minuend = minuend;
        this.subtrahend = subtrahend;
        this.initialize();
    }

    public toJSON() {
        return {
            minuend: this.minuend.toJSON(),
            subtrahend: this.subtrahend.toJSON(),
            type: SubtractNode.type,
        };
    }

    private initialize() {
        let tracks = this.minuend.getTracks();
        tracks = tracks.filter((track: Track) => !this.subtrahend.hasTrack(track));

        this.addTracks(tracks);
    }
}
