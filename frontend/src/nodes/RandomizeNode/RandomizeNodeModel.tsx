import {AbstractNodeModel} from "../AbstractNodeModel";

export default class RandomizeNodeModel extends AbstractNodeModel {
    public static getInstance(): RandomizeNodeModel {
        const node = new RandomizeNodeModel();

        node.addInPort("In");
        node.addOutPort("Out");

        return node;
    }

    constructor() {
        super("randomize-node", "Randomize", "rgb(0, 255, 100)");
    }

}
