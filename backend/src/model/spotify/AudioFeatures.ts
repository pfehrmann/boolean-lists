export class AudioFeatures {
    constructor(private raw: any) {}

    public get tempo(): number { return this.raw.tempo; }
    public get uri(): string { return this.raw.uri; }
    public get energy(): number { return this.raw.energy; }
    public get danceability(): number { return this.raw.danceability; }
    public get valence(): number { return this.raw.valence; }
}
