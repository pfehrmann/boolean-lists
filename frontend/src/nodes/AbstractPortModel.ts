import * as _ from "lodash";
import * as SRD from "storm-react-diagrams";

export class AbstractPortModel extends SRD.PortModel {
    public in: boolean;
    public label: string;
    public links: { [id: string]: SRD.DefaultLinkModel };

    constructor(isInput: boolean, name: string, label?: string, id?: string) {
        super(name, "default", id);
        this.in = isInput;
        this.label = label || name;
    }

    public deSerialize(object: any, engine: SRD.DiagramEngine) {
        super.deSerialize(object, engine);
        this.in = object.in;
        this.label = object.label;
    }

    public serialize() {
        return _.merge(super.serialize(), {
            in: this.in,
            label: this.label,
        });
    }

    public link(port: SRD.PortModel): SRD.LinkModel {
        const link = this.createLinkModel();
        link.setSourcePort(this);
        link.setTargetPort(port);
        return link;
    }

    public canLinkToPort(port: SRD.PortModel): boolean {
        if (port instanceof AbstractPortModel) {
            return this.in !== port.in;
        }
        return true;
    }

    public createLinkModel(): SRD.LinkModel {
        const link = super.createLinkModel();
        return link || new SRD.DefaultLinkModel();
    }
}
