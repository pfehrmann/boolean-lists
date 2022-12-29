import * as SRD from "storm-react-diagrams";

import { AbstractNodeWidget, IAbstractNodeProps } from "../AbstractNodeWidget";
import MyLibraryNodeModel from "./MyLibraryNodeModel";

export interface IMyTopTracksNodeProps
  extends IAbstractNodeProps<MyLibraryNodeModel> {
  node: MyLibraryNodeModel;
  diagramEngine: SRD.DiagramEngine;
}

export default class MyLibraryNodeWidget extends AbstractNodeWidget<IMyTopTracksNodeProps> {
  constructor(props: IMyTopTracksNodeProps) {
    super("my-library-node", props);

    this.onDoubleClick = this.onDoubleClick.bind(this);
  }

  public onDoubleClick() {
    this.setState({
      configOpen: true,
    });
  }
}
