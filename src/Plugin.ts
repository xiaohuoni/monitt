import { type IApi } from './Monitor';
import { Lazy } from './Lazy';

export class Plugin extends Lazy {
  constructor(api: IApi) {
    super();
    this.api = api;
  }
  api: IApi;
  public key = '';
  install(api: IApi) {}
}
