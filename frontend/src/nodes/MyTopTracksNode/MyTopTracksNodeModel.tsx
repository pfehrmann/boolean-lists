import { AbstractNodeModel } from "../AbstractNodeModel";

export default class MyTopTracksNodeModel extends AbstractNodeModel {
  public static getInstance(): MyTopTracksNodeModel {
    const node = new MyTopTracksNodeModel();

    node.addOutPort("Out");

    return node;
  }

  constructor() {
    super("my-top-tracks-node", "Top Tracks", "rgb(0, 255, 100)");

    this.configuration = {
      timeRange: 20,
      type: "MyTopTracksNode",
    };
  }
}
