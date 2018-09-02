import {AbstractNodeFactory} from "./AbstractNodeFactory";
import PlaylistNodeModel from "./PlaylistNodeModel";

export default class PlaylistNodeFactory extends AbstractNodeFactory<PlaylistNodeModel> {
    constructor() {
        super("playlist-node");
    }

    public getNewInstance() {
        return new PlaylistNodeModel();
    }
}
