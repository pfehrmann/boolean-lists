import {AbstractNodeModel} from "../AbstractNodeModel";

export default class AlbumNodeModel extends AbstractNodeModel {
    public static getInstance(): AlbumNodeModel {
        const node = new AlbumNodeModel();

        node.addOutPort("Out");

        return node;
    }

    constructor() {
        super("album-node", "Album", "rgb(0, 255, 100)");

        this.configuration = {
            id: "14ytmU7xtCIigHDRRYm0Hq",
            type: "AlbumNode",
        }
    }
}
