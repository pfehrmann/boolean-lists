import {AbstractNodeFactory} from "../AbstractNodeFactory";
import SubtractNodeModel from "./SubtractNodeModel";
import SubtractNodeWidget from "./SubtractNodeWidget";

export default class SubtractNodeFactory extends AbstractNodeFactory<SubtractNodeModel> {
    constructor() {
        super("subtract-node");
    }

    public getClassType() {
        return SubtractNodeWidget;
    }

    public getNewInstance() {
        return new SubtractNodeModel();
    }
}
