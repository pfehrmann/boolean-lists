import type { OutputPort } from './OutputPort';
import type { Port } from './Port';

export interface Node<NodeType = string, DataType = string> {
  id: string;
  type: NodeType;
  inputs: Port<DataType>[];
  outputs: OutputPort<DataType>[];
  position: {
    x: number;
    y: number;
  };
}
