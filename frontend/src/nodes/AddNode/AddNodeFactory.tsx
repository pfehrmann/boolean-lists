import {AbstractNodeFactory} from "../AbstractNodeFactory";
import AddNodeModel from "./AddNodeModel";
import AddNodeWidget from "./AddNodeWidget";

export default class AddNodeFactory extends AbstractNodeFactory<AddNodeModel> {
    constructor() {
        super("add-node");
    }

    public getClassType() {
        return AddNodeWidget;
    }

    public getNewInstance() {
        return new AddNodeModel();
    }
}
