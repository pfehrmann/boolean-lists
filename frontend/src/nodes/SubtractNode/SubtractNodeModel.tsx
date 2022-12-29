import * as SRD from 'storm-react-diagrams';

import { AbstractNodeModel } from '../AbstractNodeModel';
import { SubtractPortModel } from './SubtractPortModel';

export default class SubtractNodeModel extends AbstractNodeModel {
  public static getInstance(): SubtractNodeModel {
    const node = new SubtractNodeModel();

    node.addInPort('In');
    node.addInPort('Subtract');
    node.addOutPort('Out');

    return node;
  }

  constructor() {
    super('subtract-node', 'Subtract Playlists', 'rgb(0, 255, 100)');
  }

  public addInPort(label: string): SubtractPortModel {
    return this.addPort(new SubtractPortModel(true, SRD.Toolkit.UID(), label));
  }

  public addOutPort(label: string): SubtractPortModel {
    return this.addPort(new SubtractPortModel(false, SRD.Toolkit.UID(), label));
  }
}
