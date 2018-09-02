import {AbstractNodeFactory} from "./AbstractNodeFactory";
import AddNodeModel from "./AddNodeModel";

export default class AddNodeFactory extends AbstractNodeFactory<AddNodeModel> {
    constructor() {
        super("add-node");
    }

    public getNewInstance() {
        return new AddNodeModel();
    }
}
