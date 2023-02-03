import { v4 as uuidv4 } from 'uuid';

import { Node } from '../../types/Node';
import { ExampleDataType, ExampleNodes } from '../types';

export function generateMyLibraryNode(): Omit<
  Node<ExampleNodes, ExampleDataType>,
  'id' | 'position'
> {
  return {
    type: 'MyLibrary',
    inputs: [],
    outputs: [
      {
        id: uuidv4(),
        dataType: 'songs',
        name: 'My Library',
      },
    ],
  };
}
