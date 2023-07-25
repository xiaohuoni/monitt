import { type IApi } from './Monitor';
import { Lazy } from './Lazy';
import { EventData } from './EventData';

export class Plugin extends Lazy {
  constructor(api: IApi) {
    super();
    this.api = api;
  }
  api: IApi;
  public key = '';
  install(api: IApi) {}
  newEventData(data: any) {
    return new EventData({
      name: this.key,
      ...data,
    });
  }
}
