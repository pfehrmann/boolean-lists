import {AbstractNodeFactory} from "../AbstractNodeFactory";
import FilterByAudioFeatureNodeModel from "./FilterByAudioFeatureNodeModel";
import FilterByAudioFeatureNodeWidget from "./FilterByAudioFeatureNodeWidget";

export default class FilterByAudioFeatureNodeFactory extends AbstractNodeFactory<FilterByAudioFeatureNodeModel> {
    constructor() {
        super("filter-by-audio-features-node");
    }

    public getClassType() {
        return FilterByAudioFeatureNodeWidget;
    }

    public getNewInstance() {
        return new FilterByAudioFeatureNodeModel();
    }
}
