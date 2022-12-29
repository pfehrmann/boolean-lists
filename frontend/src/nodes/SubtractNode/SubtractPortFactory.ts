import { AbstractPortFactory } from "storm-react-diagrams";
import { SubtractPortModel } from "./SubtractPortModel";

export default class SubtractPortFactory extends AbstractPortFactory<SubtractPortModel> {
  constructor() {
    super("SubtractPort");
  }

  public getNewInstance(initialConfig?: any): SubtractPortModel {
    return new SubtractPortModel(true, "unknown");
  }
}
