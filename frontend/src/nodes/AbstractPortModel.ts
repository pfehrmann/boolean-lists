import * as _ from 'lodash';
import * as SRD from 'storm-react-diagrams';

import { AbstractNodeModel } from './AbstractNodeModel';

export class AbstractPortModel extends SRD.PortModel {
  public in: boolean;
  public label: string;
  public links: { [id: string]: SRD.DefaultLinkModel };

  constructor(
    isInput: boolean,
    name: string,
    label?: string,
    type: string = 'AbstractPort',
    id?: string,
  ) {
    super(name, type, id);
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

  public canLinkToPort(port: SRD.PortModel, propagate = true): boolean {
    if (port === this) {
      return false;
    }

    if (
      port instanceof SRD.DefaultPortModel ||
      port instanceof AbstractPortModel
    ) {
      if (this.in === port.in) {
        return false;
      }
    }

    if (port instanceof AbstractPortModel) {
      if (
        _.includes(port.getReachableParents(), this) ||
        _.includes(port.getReachableChildren(), this)
      ) {
        alert('You are creating a loop, these nodes cannot be connected.');
        return false;
      }
    } else {
      alert('One of the nodes is an old node, can not connect.');
      return false;
    }

    if (propagate) {
      return port.canLinkToPort(this, false);
    }

    return true;
  }

  public createLinkModel(): SRD.LinkModel {
    const link = super.createLinkModel();
    return link || new SRD.DefaultLinkModel();
  }

  private getReachableParents(reachablePorts: AbstractPortModel[] = []) {
    reachablePorts.push(this);

    const ports = this.getParents();

    for (const port of ports) {
      if (!_.includes(reachablePorts, port)) {
        reachablePorts = port.getReachableParents(reachablePorts);
      }
    }
    return reachablePorts;
  }

  private getReachableChildren(reachablePorts: AbstractPortModel[] = []) {
    reachablePorts.push(this);

    const ports = this.getChildren();

    for (const port of ports) {
      if (!_.includes(reachablePorts, port)) {
        reachablePorts = port.getReachableChildren(reachablePorts);
      }
    }
    return reachablePorts;
  }

  private getChildren(): AbstractPortModel[] {
    let ports = (this.getNode() as AbstractNodeModel).getInPorts();
    ports = ports.filter((port) => port !== this);
    let links: SRD.LinkModel[] = [];
    for (const port of ports) {
      links = links.concat(_.filter(port.getLinks(), () => true));
    }

    let children: AbstractPortModel[] = [];
    for (const link of links) {
      let otherPort = link.getSourcePort() as AbstractPortModel;
      if (otherPort.serialize() === this.serialize()) {
        otherPort = link.getTargetPort() as AbstractPortModel;
      }
      const otherNode = otherPort.getNode() as AbstractNodeModel;
      children = children.concat(otherNode.getInPorts());
    }
    return children;
  }

  private getParents(): AbstractPortModel[] {
    let ports = (this.getNode() as AbstractNodeModel).getOutPorts();
    ports = ports.filter((port) => port !== this);
    let links: SRD.LinkModel[] = [];
    for (const port of ports) {
      links = links.concat(_.filter(port.getLinks(), () => true));
    }

    let parents: AbstractPortModel[] = [];
    for (const link of links) {
      let otherPort = link.getSourcePort() as AbstractPortModel;
      if (otherPort.serialize() === this.serialize()) {
        otherPort = link.getTargetPort() as AbstractPortModel;
      }
      const otherNode = otherPort.getNode() as AbstractNodeModel;
      parents = parents.concat(otherNode.getOutPorts());
    }
    return parents;
  }
}
