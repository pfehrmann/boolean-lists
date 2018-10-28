import {AbstractNodeModel} from "../AbstractNodeModel";

export default class LimitNodeModel extends AbstractNodeModel {
    public static getInstance(): LimitNodeModel {
        const node = new LimitNodeModel();

        node.addInPort("In");
        node.addOutPort("Out");

        return node;
    }

    constructor() {
        super("limit-node", "Limit", "rgb(0, 255, 100)");

        this.configuration = {
            limit: 20,
            type: "LimitNode",
        };
    }
}
