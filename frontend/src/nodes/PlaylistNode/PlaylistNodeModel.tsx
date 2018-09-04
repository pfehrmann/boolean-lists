import {AbstractNodeModel} from "../AbstractNodeModel";

export default class PlaylistNodeModel extends AbstractNodeModel {
    public static getInstance(): PlaylistNodeModel {
        const node = new PlaylistNodeModel();

        node.addOutPort("Out");

        return node;
    }

    constructor() {
        super("playlist-node", "Playlist", "rgb(0, 255, 100)");

        this.configuration = {
            id: "14ytmU7xtCIigHDRRYm0Hq",
            type: "SpotifyPlaylistNode",
            userId: "9v08daxud6qg0kui6dvkvklmo"
        }
    }
}
