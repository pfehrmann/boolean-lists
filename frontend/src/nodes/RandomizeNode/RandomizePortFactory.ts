import {AbstractPortFactory} from "storm-react-diagrams";
import {RandomizePortModel} from "./RandomizePortModel";

export default class RandomizePortFactory extends AbstractPortFactory<RandomizePortModel> {
    constructor() {
        super("RandomizePort");
    }

    public getNewInstance(initialConfig?: any): RandomizePortModel {
        return new RandomizePortModel(true, "unknown");
    }
}
