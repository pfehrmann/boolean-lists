import {AudioFeatures} from "./AudioFeatures";
import {InitializedSpotifyApi} from "./SpotifyApi";

import * as logger from "winston";

export class Track {
    constructor(private track: any, private api: InitializedSpotifyApi) {
        if (!api) {
            throw new Error("No API given for instantiation");
        }

        let times = 0;
        while (!this.track.uri && times++ < 5) {
            this.track = this.track.track;
        }

        if (times >= 5) {
            throw new Error("Could not instantiate Track, uri was not found.");
        }
    }

    public uri() {
        return this.track.uri;
    }

    public isLocal(): boolean {
        return this.track.is_local;
    }

    public equals(object: Track): boolean {
        return this.uri() === object.uri();
    }

    public async audioFeatures(): Promise<AudioFeatures> {
        try {
            return (await this.api.getAudioFeature(this.uri()));
        } catch (err) {
            logger.error(err);
        }
    }
}
