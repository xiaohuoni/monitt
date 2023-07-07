import { Emit } from './Emit';
import { DataCache } from './Cache';
import { EventData } from './EventData';
import { Lazy } from './Lazy';

enum EVENTS {
  start = 'start',
  destroy = 'destroy',
}

type Actions = (e: Monitor) => void;
export type IApi = Monitor & {
  start: (arg0: Actions) => void;
  destroy: (arg0: Actions) => void;
};

export class Monitor extends Emit {
  instance = {};
  dataCache: DataCache;
  lazy: Lazy;
  constructor() {
    super();
    this.dataCache = new DataCache();
    this.lazy = new Lazy();
    this.plugins = [];
    this.skipPlugins = [''];
    this.instance = new Proxy(this, {
      get(target: any, p: string) {
        if (target[p]) {
          return target[p];
        }
        if (EVENTS[p]) {
          return function (callback: any) {
            target.useSubscription(p as string, callback);
          };
        }
        return function () {
          console.error(`${p as string} 方法未定义`);
        };
      },
    });
  }
  // 展示的所有组件
  public plugins: any[] = [];
  public skipPlugins: string[] = [];

  // 启动埋点
  public run() {
    this.emit(EVENTS.start, this);
  }
  // this 指向测试方法，无实际用处
  public haha() {
    console.log('haha');
  }
  //  销毁，也会销毁所有的插件
  public stop() {
    this.emit(EVENTS.destroy, {});
    this.plugins.length = 0;
  }
  use(plugin: any) {
    const p = new plugin(this.instance);
    if (!this.skipPlugins.includes(p.key)) {
      p.install(this.instance);
      this.plugins.push(p);
    }
  }
  send(data: EventData[]) {
    console.log('请求接口，发送数据', data);
  }

  lazySend(data: EventData, timeout = 3000) {
    this.dataCache.addCache(data);
    console.log('lazySend', data);
    this.lazy.listenerHandle(() => {
      const data = this.dataCache.getCache();
      console.log('lazySend listenerHandle', data);
      if (data.length) {
        this.send(data);
        this.dataCache.clearCache();
      }
    }, timeout);
  }
}
