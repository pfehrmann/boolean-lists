import * as _ from "lodash";
import * as SRD from "storm-react-diagrams";

export class AbstractNodeModel extends SRD.NodeModel {
    public name: string;
    public color: string;
    public ports: { [s: string]: SRD.DefaultPortModel };

    constructor(className: string, name: string, color: string = "rgb(0,192,255)") {
        super(className);
        this.name = name;
        this.color = color;
    }

    public addInPort(label: string): SRD.DefaultPortModel {
        return this.addPort(new SRD.DefaultPortModel(true, SRD.Toolkit.UID(), label));
    }

    public addOutPort(label: string): SRD.DefaultPortModel {
        return this.addPort(new SRD.DefaultPortModel(false, SRD.Toolkit.UID(), label));
    }

    public deSerialize(object: any, engine: SRD.DiagramEngine) {
        this.deSerialize(object, engine);
        this.name = object.name;
        this.color = object.color;
    }

    public serialize(): any {
        return _.merge(this.serialize(), {
            color: this.color,
            name: this.name
        });
    }

    public getInPorts(): SRD.DefaultPortModel[] {
        return _.filter(this.ports, portModel => {
            return portModel.in;
        });
    }

    public getOutPorts(): SRD.DefaultPortModel[] {
        return _.filter(this.ports, portModel => {
            return !portModel.in;
        });
    }
}