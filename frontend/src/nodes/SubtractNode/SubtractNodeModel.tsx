import {AbstractNodeModel} from "../AbstractNodeModel";

export default class SubtractNodeModel extends AbstractNodeModel {
    public static getInstance(): SubtractNodeModel {
        const node = new SubtractNodeModel();

        node.addInPort("In");
        node.addInPort("Subtract");
        node.addOutPort("Out");

        return node;
    }

    constructor() {
        super("subtract-node", "Subtract Playlists", "rgb(0, 255, 100)");
    }

}
