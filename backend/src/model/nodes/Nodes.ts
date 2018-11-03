import {IChangeListener, IObservable} from "../../util";
import {Track} from "../spotify/Track";

export abstract class PlaylistNode implements IObservable {
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
