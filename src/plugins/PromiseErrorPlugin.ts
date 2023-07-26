import { Plugin } from '../Plugin';
import { type IApi } from '../Monitor';

export class PromiseErrorPlugin extends Plugin {
  constructor(api: IApi) {
    super(api);
  }
  public key = 'promise-error';
  handleError = (event: Event) => {
    this.listenerHandle(() => {
      this.api.lazySend(
        this.newEventData({
          data: {
            // @ts-ignore
            reason: event?.reason?.stack,
            subType: 'promise',
            type: 'error',
            startTime: event.timeStamp,
            pageURL: window.location.href,
          },
        }),
      );
    });
  };
  install(api: IApi) {
    api.start(() => {
      api.addEventListener('unhandledrejection', this.handleError);
    });
    api.pageshow(() => {
      api.addEventListener('unhandledrejection', this.handleError);
    });
    api.destroy(() => {
      api.removeEventListener('unhandledrejection', this.handleError);
    });
  }
}
