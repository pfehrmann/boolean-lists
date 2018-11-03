import * as Spotify from "../spotify/SpotifyApi";
import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {IntermediatePlaylist} from "./IntermediatePlaylist";

export class TopTracksNode extends IntermediatePlaylist {

    static get type(): string {
        return "TopTracksNode";
    }

    public static async createNew(api: InitializedSpotifyApi, timeRange: Spotify.TimeRanges): Promise<TopTracksNode> {
        const node = new TopTracksNode(timeRange);
        await node.initialize(api);
        return node;
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<TopTracksNode> {
        return await TopTracksNode.createNew(api, json.timeRange);
    }

    private timeRange: Spotify.TimeRanges;

    private constructor(timeRange) {
        super();
        this.timeRange = timeRange;
    }

    public toJSON() {
        return {
            timeRange: this.timeRange,
            type: TopTracksNode.type,
        };
    }

    private async initialize(api: InitializedSpotifyApi) {
        const tracks = await api.getMyTopTracks(this.timeRange);
        this.addTracks(tracks);
    }
}
