import { Plugin } from '../Plugin';
import { type IApi } from '../Monitor';

const pkgsHash = {
  'ant-': {
    prefix: 'antd-',
    pkg: 'antd',
  },
} as any;

function capitalizeFirstLetter(str: string = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
const getComponentType = (classlist: string = '') => {
  const unknown = {
    pkg: 'unknown',
    type: 'unknown',
  };
  if (!classlist) {
    return unknown;
  }
  const keys = Object.keys(pkgsHash);
  for (let i = 0; i < keys.length; ) {
    const key = keys[i];
    if (classlist.includes(key)) {
      const type = classlist.split(' ')[0].replace(key, '');
      return {
        pkg: pkgsHash[key].pkg,
        type: capitalizeFirstLetter(type),
      };
    }
  }
  return unknown;
};
export class ClickPlugin extends Plugin {
  constructor(api: IApi) {
    super(api);
  }
  public key = 'click';
  handleClick = (event: Event) => {
    this.listenerHandle(() => {
      const target: any = event.target;
      // TODO: for test
      if (!target) {
        this.api.lazySend(
          this.newEventData({
            data: {},
          }),
        );
        return;
      }
      // 忽略点击全局
      if (target?.tagName === 'HTML') {
        return;
      }
      const eventType = event.type;

      const { top = 0, left = 0 } = target?.getBoundingClientRect();
      var classList = target?.classList?.value;
      const { pkg, type } = getComponentType(classList);
      // 上报
      this.api.lazySend(
        this.newEventData({
          data: {
            top,
            left,
            eventType,
            pageHeight:
              document.documentElement.scrollHeight ||
              document.body.scrollHeight,
            scrollTop:
              document.documentElement.scrollTop || document.body.scrollTop,
            target: target.tagName,
            startTime: event.timeStamp,
            pageURL: window.location.href,
            outerHTML: target.outerHTML,
            innerHTML: target.innerHTML,
            width: target.offsetWidth,
            height: target.offsetHeight,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight,
            },
            pkg,
            type,
          },
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
