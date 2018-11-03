export class Track {
    private track: any;

    constructor(track: any) {
        this.track = track;

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

    public equals(object: Track): boolean {
        return this.uri() === object.uri();
    }
}
