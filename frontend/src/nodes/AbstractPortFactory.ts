import * as SRD from "storm-react-diagrams";
import {AbstractPortModel} from "./AbstractPortModel";

export default class AbstractPortFactory extends SRD.AbstractPortFactory<AbstractPortModel> {
    constructor() {
        super("AbstractPort");
    }

    public getNewInstance(initialConfig?: any): AbstractPortModel {
        return new AbstractPortModel(true, "unknown");
    }
}
