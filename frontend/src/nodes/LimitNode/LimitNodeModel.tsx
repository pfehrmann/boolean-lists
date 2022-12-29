import * as SRD from "storm-react-diagrams";
import { AbstractNodeModel } from "../AbstractNodeModel";
import { LimitPortModel } from "./LimitPortModel";

export default class LimitNodeModel extends AbstractNodeModel {
  public static getInstance(): LimitNodeModel {
    const node = new LimitNodeModel();

    node.addInPort("In");
    node.addOutPort("Out");

    return node;
  }

  constructor() {
    super("limit-node", "Limit", "rgb(0, 255, 100)");

    this.configuration = {
      limit: 20,
      type: "LimitNode",
    };
  }

  public addInPort(label: string): LimitPortModel {
    return this.addPort(new LimitPortModel(true, SRD.Toolkit.UID(), label));
  }

  public addOutPort(label: string): LimitPortModel {
    return this.addPort(new LimitPortModel(false, SRD.Toolkit.UID(), label));
  }
}
