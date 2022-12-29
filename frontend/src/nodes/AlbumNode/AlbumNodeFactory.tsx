import { AbstractNodeFactory } from "../AbstractNodeFactory";
import AlbumNodeModel from "./AlbumNodeModel";
import AlbumNodeWidget from "./AlbumNodeWidget";

export default class AlbumNodeFactory extends AbstractNodeFactory<AlbumNodeModel> {
  constructor() {
    super("album-node");
  }

  public getClassType() {
    return AlbumNodeWidget;
  }

  public getNewInstance() {
    return new AlbumNodeModel();
  }
}
