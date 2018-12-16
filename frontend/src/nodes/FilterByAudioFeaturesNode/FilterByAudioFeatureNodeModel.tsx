import * as SRD from "storm-react-diagrams";
import {AbstractNodeModel} from "../AbstractNodeModel";
import {FilterByAudioFeaturePortModel} from "./FilterByAudioFeaturePortModel";

export default class FilterByAudioFeatureNodeModel extends AbstractNodeModel {
    public static getInstance(): FilterByAudioFeatureNodeModel {
        const node = new FilterByAudioFeatureNodeModel();

        node.addInPort("In");
        node.addOutPort("Out");

        return node;
    }

    constructor() {
        super("filter-by-audio-features-node", "Filter by Audio Feature", "rgb(0, 255, 100)");

        this.configuration = {
            feature: "tempo",
            from: 0,
            to: 0,
            type: "FilterAudioFeaturesNode",
        };
    }

    public addInPort(label: string): FilterByAudioFeaturePortModel {
        return this.addPort(new FilterByAudioFeaturePortModel(true, SRD.Toolkit.UID(), label));
    }

    public addOutPort(label: string): FilterByAudioFeaturePortModel {
        return this.addPort(new FilterByAudioFeaturePortModel(false, SRD.Toolkit.UID(), label));
    }
}
