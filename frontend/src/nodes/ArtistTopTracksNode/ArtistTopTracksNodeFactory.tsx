import { AbstractNodeFactory } from '../AbstractNodeFactory';
import ArtistTopTracksNodeModel from './ArtistTopTracksNodeModel';
import ArtistTopTracksNodeWidget from './ArtistTopTracksNodeWidget';

export default class ArtistTopTracksNodeFactory extends AbstractNodeFactory<ArtistTopTracksNodeModel> {
  constructor() {
    super('artist-top-tracks-node');
  }

  public getClassType() {
    return ArtistTopTracksNodeWidget;
  }

  public getNewInstance() {
    return new ArtistTopTracksNodeModel();
  }
}
