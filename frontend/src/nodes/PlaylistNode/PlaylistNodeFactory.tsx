import { AbstractNodeFactory } from '../AbstractNodeFactory';
import PlaylistNodeModel from './PlaylistNodeModel';
import PlaylistNodeWidget from './PlaylistNodeWidget';

export default class PlaylistNodeFactory extends AbstractNodeFactory<PlaylistNodeModel> {
  constructor() {
    super('playlist-node');
  }

  public getClassType() {
    return PlaylistNodeWidget;
  }

  public getNewInstance() {
    return new PlaylistNodeModel();
  }
}
