import { Plugin } from '../Plugin';
import { type IApi } from '../Monitor';
import { EventData } from '../EventData';
export class ClickPlugin extends Plugin {
  constructor(api: IApi) {
    super(api);
  }
  public key = 'click';
  handleClick = (event: Event) => {
    this.listenerHandle(() => {
      const target = event.target;
      // 上报
      this.api.lazySend(
        new EventData({
          name: 'click',
          data: {},
        }),
      );
    });
  };
  install(api: IApi) {
    api.start(() => {
      ['mousedown', 'touchstart'].forEach((eventType: string) => {
        api.addEventListener(eventType, this.handleClick);
      });
    });
    api.destroy(() => {
      ['mousedown', 'touchstart'].forEach((eventType: string) => {
        api.removeEventListener(eventType, this.handleClick);
      });
    });
  }
}
