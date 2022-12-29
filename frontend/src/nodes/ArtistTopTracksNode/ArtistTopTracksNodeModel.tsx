import { AbstractNodeModel } from '../AbstractNodeModel';

export default class ArtistTopTracksNodeModel extends AbstractNodeModel {
  public static getInstance(): ArtistTopTracksNodeModel {
    const node = new ArtistTopTracksNodeModel();

    node.addOutPort('Out');

    return node;
  }

  constructor() {
    super('artist-top-tracks-node', 'Artist Top Tracks', 'rgb(0, 255, 100)');

    this.configuration = {
      id: '6vwjIs0tbIiseJMR3pqwiL',
      type: 'ArtistTopTracksNode',
    };
  }
}
