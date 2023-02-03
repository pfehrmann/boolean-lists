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
  /**
   * This callback is meant to update this node to add more ports when a port is connected.
   *
   * @param upatedNode The node with updated ports
   * @returns A new node, possibly with more or less ports.
   */
  onPortsChange?: (
    upatedNode: Node<NodeType, DataType>,
  ) => Node<NodeType, DataType>;
}
