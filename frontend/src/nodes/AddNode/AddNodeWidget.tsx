import * as SRD from 'storm-react-diagrams';

import { AbstractNodeWidget, IAbstractNodeProps } from '../AbstractNodeWidget';
import AddNodeModel from './AddNodeModel';

export interface IAddNodeProps extends IAbstractNodeProps<AddNodeModel> {
  node: AddNodeModel;
  diagramEngine: SRD.DiagramEngine;
}

export default class AddNodeWidget extends AbstractNodeWidget<IAddNodeProps> {
  constructor(props: IAddNodeProps) {
    super('add-node', props);
    this.state = {};
  }

  public onDoubleClick() {
    // no config
  }
}
