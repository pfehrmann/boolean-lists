import { styled } from '@mui/material';
import React from 'react';

import { Port } from './Port';

interface PortType<DataType> {
  id: string;
  name: string;
  dataType: DataType;
}

export interface NodeProps<
  NodeTypes extends string = string,
  DataType extends string = string,
> {
  ports: PortType<DataType>[];
  className?: string;
  orientation: 'left' | 'right';
}

export const PortList = <
  NodeTypes extends string = string,
  DataType extends string = string,
>({
  ports,
  className,
  orientation,
}: NodeProps<NodeTypes, DataType>) => {
  return (
    <Root className={className}>
      {ports.map((port) => (
        <Port ball={orientation === 'left' ? 'start' : 'end'} key={port.id}>
          {port.name}
        </Port>
      ))}
    </Root>
  );
};

const Root = styled('div')`
  min-width: 2rem;
`;
