import {AbstractNodeModel} from "./AbstractNodeModel";

export default class PlaylistNodeModel extends AbstractNodeModel {

    constructor() {
        super("playlist-node", "Playlist", "rgb(0, 255, 100)");

        this.addOutPort("Out");

        this.configuration = {
            id: "14ytmU7xtCIigHDRRYm0Hq",
            type: "SpotifyPlaylistNode",
            userId: "9v08daxud6qg0kui6dvkvklmo"
        }
    }
}
