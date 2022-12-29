import * as _ from "lodash";
import * as SRD from "storm-react-diagrams";
import { AbstractPortModel } from "../AbstractPortModel";

export class SubtractPortModel extends AbstractPortModel {
  public in: boolean;
  public label: string;
  public links: { [id: string]: SRD.DefaultLinkModel };

  constructor(isInput: boolean, name: string, label?: string, id?: string) {
    super(isInput, name, label, "SubtractPort", id);
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

  public canLinkToPort(port: SRD.PortModel, propagate = true): boolean {
    if (
      this.in &&
      _.find(this.links, (link) => {
        // check if this link does not connect both ports
        return !(
          (link.getSourcePort() === this && link.getTargetPort() === port) ||
          (link.getSourcePort() === port && link.getTargetPort() === this)
        );
      })
    ) {
      alert("This node accepts only one input");
      return false;
    }

    return super.canLinkToPort(port, propagate);
  }
}
