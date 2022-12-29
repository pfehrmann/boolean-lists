import * as SRD from "storm-react-diagrams";
import { AbstractNodeModel } from "../AbstractNodeModel";
import { RandomizePortModel } from "./RandomizePortModel";

export default class RandomizeNodeModel extends AbstractNodeModel {
  public static getInstance(): RandomizeNodeModel {
    const node = new RandomizeNodeModel();

    node.addInPort("In");
    node.addOutPort("Out");

    return node;
  }

  constructor() {
    super("randomize-node", "Randomize", "rgb(0, 255, 100)");
  }

  public addInPort(label: string): RandomizePortModel {
    return this.addPort(new RandomizePortModel(true, SRD.Toolkit.UID(), label));
  }

  public addOutPort(label: string): RandomizePortModel {
    return this.addPort(
      new RandomizePortModel(false, SRD.Toolkit.UID(), label)
    );
  }
}
