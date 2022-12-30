import { Node } from '../types/Node';

export interface NodeContent<
  NodeTypes extends string = string,
  DataType extends string = string,
> {
  (props: {
    node: Node<NodeTypes, DataType>;
    className?: string;
  }): JSX.Element | null;
}
