import * as _ from "lodash";
import * as SRD from "storm-react-diagrams";
import {AbstractPortModel} from "./AbstractPortModel";

export class AbstractNodeModel extends SRD.NodeModel {
    public name: string;
    public color: string;
    public ports: { [s: string]: AbstractPortModel };
    public configuration: any;

    constructor(className: string, name: string, color: string = "rgb(0,192,255)") {
        super(className);
        this.name = name;
        this.color = color;
    }

    public addInPort(label: string): AbstractPortModel {
        return this.addPort(new AbstractPortModel(true, SRD.Toolkit.UID(), label));
    }

    public addOutPort(label: string): AbstractPortModel {
        return this.addPort(new AbstractPortModel(false, SRD.Toolkit.UID(), label));
    }

    public deSerialize(object: any, engine: SRD.DiagramEngine) {
        super.deSerialize(object, engine);
        this.name = object.name;
        this.color = object.color;
        this.configuration = object.configuration;
    }

    public serialize(): any {
        return _.merge(super.serialize(), {
            color: this.color,
            configuration: this.configuration,
            name: this.name,
        });
    }

    public getInPorts(): AbstractPortModel[] {
        return _.filter(this.ports, (portModel) => {
            return portModel.in;
        });
    }

    public getOutPorts(): AbstractPortModel[] {
        return _.filter(this.ports, (portModel) => {
            return !portModel.in;
        });
    }
}
