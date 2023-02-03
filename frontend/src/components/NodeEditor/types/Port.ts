import type { Node } from './Node';
import { OutputPort } from './OutputPort';

export interface Port<DataType = string> {
  id: string;
  name: string;
  dataType: DataType;
  acceptedNodes: DataType[];
  incommingNodes: OutputPort<DataType>[];
  canConnect?(node: Node, port: OutputPort<DataType>): boolean;
}
