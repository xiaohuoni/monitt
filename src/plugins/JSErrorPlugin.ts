import { Plugin } from '../Plugin';
import { type IApi } from '../Monitor';

export class JSErrorPlugin extends Plugin {
  constructor(api: IApi) {
    super(api);
  }
  public key = 'js-error';
  handleError: OnErrorEventHandler = (msg, url, line, column, error) => {
    this.listenerHandle(() => {
      this.api.lazySend(
        this.newEventData({
          data: {
            msg,
            line,
            column,
            error: error?.stack,
            subType: 'js',
            pageURL: url,
            type: 'error',
            startTime: performance.now(),
          },
        }),
      );
    });
  };
  install(api: IApi) {
    api.pageshow(() => {
      window.onerror = this.handleError;
    });
    api.start(() => {
      window.onerror = this.handleError;
    });
  }
}
