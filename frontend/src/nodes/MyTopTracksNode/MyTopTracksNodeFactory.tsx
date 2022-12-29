import { AbstractNodeFactory } from "../AbstractNodeFactory";
import MyTopTracksNodeModel from "./MyTopTracksNodeModel";
import MyTopTracksNodeWidget from "./MyTopTracksNodeWidget";

export default class MyTopTracksNodeFactory extends AbstractNodeFactory<MyTopTracksNodeModel> {
  constructor() {
    super("my-top-tracks-node");
  }

  public getClassType() {
    return MyTopTracksNodeWidget;
  }

  public getNewInstance() {
    return new MyTopTracksNodeModel();
  }
}
