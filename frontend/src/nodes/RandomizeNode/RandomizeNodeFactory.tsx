import { AbstractNodeFactory } from '../AbstractNodeFactory';
import RandomizeNodeModel from './RandomizeNodeModel';
import RandomizeNodeWidget from './RandomizeNodeWidget';

export default class RandomizeNodeFactory extends AbstractNodeFactory<RandomizeNodeModel> {
  constructor() {
    super('randomize-node');
  }

  public getClassType() {
    return RandomizeNodeWidget;
  }

  public getNewInstance() {
    return new RandomizeNodeModel();
  }
}
