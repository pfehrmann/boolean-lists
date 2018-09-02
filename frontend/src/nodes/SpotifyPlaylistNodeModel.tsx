import {NodeModel} from "storm-react-diagrams";
import SpotifyPlaylistPortModel from "./SpotifyPlaylistPortModel";

export default class SpotifyPlaylistNodeModel extends NodeModel {
    constructor() {
        super("spotifyPlaylist");
        this.addPort(new SpotifyPlaylistPortModel("top"));
        this.addPort(new SpotifyPlaylistPortModel("left"));
        this.addPort(new SpotifyPlaylistPortModel("bottom"));
        this.addPort(new SpotifyPlaylistPortModel("right"));
    }
}
