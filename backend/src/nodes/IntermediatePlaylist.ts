import {Track} from "../spotify/Track";
import {PlaylistNode} from "./Nodes";

export abstract class IntermediatePlaylist extends PlaylistNode {
    private tracks: Track[] = [];

    public constructor(tracks?: Track[]) {
        super();

        if (tracks) {
            this.tracks = tracks;
        }
    }

    public addTrack(trackToAdd: Track): void {
        this.tracks.push(trackToAdd);
        this.fireChangeEvent();
    }

    // TODO: Test this method... after all the problems with the this.something BS...
    public addTracks(tracksToAdd: Track[]): void {
        this.tracks = this.tracks.concat(tracksToAdd);
        this.fireChangeEvent();
    }

    public getTracks(): Track[] {
        return [...this.tracks];
    }
}
