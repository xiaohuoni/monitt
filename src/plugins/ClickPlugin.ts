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
      console.log(target);
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
        window.addEventListener(eventType, this.handleClick);
      });
    });
    api.destroy((e) => {
      ['mousedown', 'touchstart'].forEach((eventType: string) => {
        window.removeEventListener(eventType, this.handleClick);
      });
    });
  }
}
