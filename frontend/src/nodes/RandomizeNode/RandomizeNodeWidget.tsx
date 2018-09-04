import * as SRD from "storm-react-diagrams";

import {AbstractNodeWidget, IAbstractNodeProps} from "../AbstractNodeWidget";
import RandomizeNodeModel from "./RandomizeNodeModel";

export interface IAddNodeProps extends IAbstractNodeProps<RandomizeNodeModel> {
    node: RandomizeNodeModel;
    diagramEngine: SRD.DiagramEngine;
}

export default class RandomizeNodeWidget extends AbstractNodeWidget<IAddNodeProps> {
    constructor(props: IAddNodeProps) {
        super("randomize-node", props);
        this.state = {};
    }

    public onDoubleClick() {
        // nothing to do, no configuration needed
    }
}
