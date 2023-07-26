import { Plugin } from '../Plugin';
import { type IApi } from '../Monitor';

export class AssetsErrorPlugin extends Plugin {
  constructor(api: IApi) {
    super(api);
  }
  public key = 'assets-error';
  handleError = (event: Event) => {
    this.listenerHandle(() => {
      const target: any = event.target;
      if (!target) return;

      if (target.src || target.href) {
        const url = target.src || target.href;
        this.api.lazySend(
          this.newEventData({
            data: {
              url,
              type: 'error',
              subType: 'resource',
              startTime: event.timeStamp,
              html: target.outerHTML,
              resourceType: target.tagName,
              pageURL: window.location.href,
            },
          }),
        );
      }
    });
  };
  install(api: IApi) {
    api.start(() => {
      api.addEventListener('error', this.handleError, true);
    });
    api.pageshow(() => {
      api.addEventListener('error', this.handleError, true);
    });
    api.destroy(() => {
      api.removeEventListener('error', this.handleError, true);
    });
  }
}
