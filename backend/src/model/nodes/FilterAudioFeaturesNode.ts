import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {IntermediatePlaylist} from "./IntermediatePlaylist";
import {fromJSON} from "./JsonParser";
import {PlaylistNode} from "./Nodes";

import * as logger from "winston";

export class FilterAudioFeaturesNode extends IntermediatePlaylist {
    static get type(): string {
        return "FilterAudioFeaturesNode";
    }

    public static async fromJSON(api: InitializedSpotifyApi, json: any): Promise<FilterAudioFeaturesNode> {
        const inPlaylist = fromJSON(api, json.inPlaylist);
        const from = Number(json.from);
        const to = Number(json.to);
        const feature = json.feature;
        const node = new FilterAudioFeaturesNode(await inPlaylist, api, from, to, feature, false);
        await node.initialize();
        return node;
    }

    constructor(
        private inPlaylist: PlaylistNode,
        private api: InitializedSpotifyApi,
        private from: number,
        private to: number,
        private feature: string,
        initialize: boolean = true,
    ) {
        super();
        if (initialize) {
            this.initialize();
        }
    }

    public toJSON() {
        return {
            feature: this.feature,
            from: this.from,
            inPlaylist: this.inPlaylist.toJSON(),
            to: this.to,
            type: FilterAudioFeaturesNode.type,
        };
    }

    private async initialize() {
        const tracks = this.inPlaylist.getTracks();

        const filteredTracks = [];
        await Promise.all(tracks.map(async (track) => {
            const audioFeature = await track.audioFeatures();
            const value = audioFeature[this.feature];
            const push = value <= this.to && value >= this.from;
            if (push) {
                filteredTracks.push(track);
            }
            return push;
        }));

        this.addTracks(filteredTracks);
    }
}
