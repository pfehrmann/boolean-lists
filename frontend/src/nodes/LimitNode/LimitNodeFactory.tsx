import {AbstractNodeFactory} from "../AbstractNodeFactory";
import LimitNodeModel from "./LimitNodeModel";
import LimitNodeWidget from "./LimitNodeWidget";

export default class LimitNodeFactory extends AbstractNodeFactory<LimitNodeModel> {
    constructor() {
        super("limit-node");
    }

    public getClassType() {
        return LimitNodeWidget;
    }

    public getNewInstance() {
        return new LimitNodeModel();
    }
}
