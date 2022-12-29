import { AbstractNodeModel } from "../AbstractNodeModel";

export default class AddNodeModel extends AbstractNodeModel {
  public static getInstance(): AddNodeModel {
    const node = new AddNodeModel();

    node.addInPort("Add");
    node.addOutPort("Out");

    return node;
  }

  constructor() {
    super("add-node", "Add Playlists", "rgb(0, 255, 100)");
  }
}
