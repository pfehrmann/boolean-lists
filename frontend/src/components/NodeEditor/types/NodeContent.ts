import { PropsWithChildren } from 'react';

import { Node } from '../types/Node';

export interface NodeContent<
  NodeTypes extends string = string,
  DataType extends string = string,
  ExtraProps extends {} = {},
> {
  (
    props: ExtraProps & {
      node: Node<NodeTypes, DataType>;
      className?: string;
    },
  ): JSX.Element | null;
}

/**
 * This is either a function, that renders the complete node or a set of overrides that override a generic node
 */
export type NodeOverrides<
  NodeTypes extends string = string,
  DataType extends string = string,
> =
  | NodeContent<NodeTypes, DataType>
  | {
      container?: NodeContent<NodeTypes, DataType, PropsWithChildren>;
      header?: NodeContent<NodeTypes, DataType>;
      inputPorts?: NodeContent<NodeTypes, DataType>;
      outputPorts?: NodeContent<NodeTypes, DataType>;
    };
