import * as React from "react";
import * as SRD from "storm-react-diagrams";
import {AbstractNodeModel} from "./AbstractNodeModel";
import AddNodeWidget from "./AddNodeWidget";

export abstract class AbstractNodeFactory<T extends AbstractNodeModel> extends SRD.AbstractNodeFactory<T> {
    protected constructor(className: string) {
        super(className);
    }

    public generateReactWidget(diagramEngine: SRD.DiagramEngine, node: T): JSX.Element {
        return React.createElement(AddNodeWidget, {
            baseClass: "srd-default-node",
            className: "srd-default-node",
            diagramEngine,
            node
        });
    }

    public abstract getNewInstance(): T;
}