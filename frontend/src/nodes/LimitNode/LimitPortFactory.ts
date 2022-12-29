import { AbstractPortFactory } from 'storm-react-diagrams';

import { LimitPortModel } from './LimitPortModel';

export default class LimitPortFactory extends AbstractPortFactory<LimitPortModel> {
  constructor() {
    super('LimitPort');
  }

  public getNewInstance(initialConfig?: any): LimitPortModel {
    return new LimitPortModel(true, 'unknown');
  }
}
