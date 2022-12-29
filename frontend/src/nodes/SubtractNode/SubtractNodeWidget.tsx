import * as SRD from "storm-react-diagrams";

import { AbstractNodeWidget, IAbstractNodeProps } from "../AbstractNodeWidget";
import SubtractNodeModel from "./SubtractNodeModel";

export interface IAddNodeProps extends IAbstractNodeProps<SubtractNodeModel> {
  node: SubtractNodeModel;
  diagramEngine: SRD.DiagramEngine;
}

export default class SubtractNodeWidget extends AbstractNodeWidget<IAddNodeProps> {
  constructor(props: IAddNodeProps) {
    super("subtract-node", props);
    this.state = {};
  }

  public onDoubleClick() {
    // no configuration to make.
  }
}
