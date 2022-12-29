import { AbstractNodeModel } from '../AbstractNodeModel';

export default class MyLibraryNodeModel extends AbstractNodeModel {
  public static getInstance(): MyLibraryNodeModel {
    const node = new MyLibraryNodeModel();

    node.addOutPort('Out');

    return node;
  }

  constructor() {
    super('my-library-node', 'My Library', 'rgb(0, 255, 100)');

    this.configuration = {
      type: 'MyLibraryNode',
    };
  }
}
