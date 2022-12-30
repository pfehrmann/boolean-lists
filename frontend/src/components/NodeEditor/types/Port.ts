import type { Node } from './Node';
import { OutputPort } from './OutputPort';

export interface Port<DataType = string> {
  dataType: DataType;
  acceptedNodes: DataType[];
  incommingNodes: OutputPort<DataType>[];
  canConnect(node: Node): boolean;
}
