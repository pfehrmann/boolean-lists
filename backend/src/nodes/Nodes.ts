import {InitializedSpotifyApi} from "../spotify/SpotifyApi";
import {Track} from "../spotify/Track";
import {IChangeListener, IObservable} from "../util";
import {AddNode} from "./AddNode";
import {LimitNode} from "./LimitNode";
import {RandomizeNode} from "./RandomizeNode";
import {SpotifyPlaylistNode} from "./SpotifyPlaylistNode";
import {SubtractNode} from "./SubtractNode";
import {TopTracksNode} from "./TopTracksNode";

export abstract class PlaylistNode implements IObservable {

    public static fromJSON(api: InitializedSpotifyApi, json: { type: string }): Promise<PlaylistNode> {
        switch (json.type) {
            case SpotifyPlaylistNode.type: {
                return SpotifyPlaylistNode.fromJSON(api, json);
            }
            case AddNode.type: {
                return AddNode.fromJSON(api, json);
            }
            case SubtractNode.type: {
                return SubtractNode.fromJSON(api, json);
            }
            case TopTracksNode.type: {
                return TopTracksNode.fromJSON(api, json);
            }
            case LimitNode.type: {
                return LimitNode.fromJSON(api, json);
            }
            case RandomizeNode.type: {
                return RandomizeNode.fromJSON(api, json);
            }
        }
        throw new Error("Cannot deserialize json node.");
    }
    private changeListeners: IChangeListener[] = [];

    public abstract getTracks(): Track[];

    public addChangeListener(changeListener: IChangeListener): void {
        this.changeListeners.push(changeListener);
    }

    public removeChangeListener(changeListener: IChangeListener): void {
        const index = this.changeListeners.indexOf(changeListener, 0);
        if (index > -1) {
            this.changeListeners.splice(index, 1);
        }
    }

    public fireChangeEvent(event?: any) {
        for (const changeListener of this.changeListeners) {
            changeListener.eventFired(event);
        }
    }

    public hasTrack(track: Track): boolean {
        return this.getTracks().some((thisTrack: Track) => {
            return thisTrack.equals(track);
        });
    }

    public abstract toJSON(): { type: string };
}
