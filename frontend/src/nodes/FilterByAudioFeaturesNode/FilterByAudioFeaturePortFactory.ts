import { AbstractPortFactory } from "storm-react-diagrams";
import { FilterByAudioFeaturePortModel } from "./FilterByAudioFeaturePortModel";

export default class FilterByAudioFeaturePortFactory extends AbstractPortFactory<FilterByAudioFeaturePortModel> {
  constructor() {
    super("FilterByAudioFeaturePort");
  }

  public getNewInstance(initialConfig?: any): FilterByAudioFeaturePortModel {
    return new FilterByAudioFeaturePortModel(true, "unknown");
  }
}
