import { v4 as uuidv4 } from 'uuid';

import { Node } from '../../types/Node';
import { Port } from '../../types/Port';
import { ExampleDataType, ExampleNodes } from '../types';

export function generateAddNode(): Omit<
  Node<ExampleNodes, ExampleDataType>,
  'id' | 'position'
> {
  return {
    type: 'Add',
    inputs: [generateInputPort()],
    outputs: [
      {
        id: uuidv4(),
        dataType: 'songs',
        name: 'Combined Songs',
      },
    ],
  };
}

function generateInputPort(): Port<ExampleDataType> {
  return {
    id: uuidv4(),
    dataType: 'songs',
    name: 'Songs',
    incommingNodes: [],
    acceptedNodes: ['songs'],
    canConnect(node) {
      return true;
    },
  };
}
