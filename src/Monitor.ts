import { Emit } from './Emit';
import { DataCache } from './Cache';
import { EventData } from './EventData';
import { Lazy } from './Lazy';
import { Sender } from './Sender';
import { Config, ConfigProps } from './Config';

const EVENTS = ['start', 'pageshow', 'destroy'];

export enum PluginApi {
  start = 'start',
  pageshow = 'pageshow',
  destroy = 'destroy',
}

type Actions = (e: Monitor) => void;
export type IApi = Monitor & {
  start: (arg0: Actions) => void;
  pageshow: (arg0: Actions) => void;
  destroy: (arg0: Actions) => void;
};

export class Monitor extends Emit {
  public instance = {};
  // 缓存数据，用于合并短时间内的埋点数据
  dataCache: DataCache;
  // 延迟执行函数
  lazy: Lazy;
  // 延迟发送的时间，默认 3 秒
  lazySengTimeout: number = 3000;
  // 配置
  config: ConfigProps = {};
  // 发送器，默认使用 sendBeacon 在空闲时发送，支持自定义
  sender: Sender;
  listenerEmit: Emit;
  // 用户，通过 setUserData 设置，每一次饭送数据的时候会携带
  userData: any = {};
  constructor(config?: Config) {
    super();
    this.config = new Config(config || {});
    this.sender = new Sender(this.config);
    this.listenerEmit = new Emit();
    this.dataCache = new DataCache();
    this.lazy = new Lazy();
    this.plugins = [];
    this.instance = new Proxy(this, {
      get(target: any, p: string) {
        if (target[p]) {
          return target[p];
        }
        if (EVENTS.includes(p)) {
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
  // 所有的插件
  public plugins: any[] = [];

  // 启动埋点
  public run() {
    this.emit(PluginApi.start, this);
    window.addEventListener(
      PluginApi.pageshow,
      (event) => {
        if (event.persisted) {
          this.emit(PluginApi.pageshow, this);
        }
      },
      true,
    );
  }
  // this 指向测试方法，无实际用处
  public haha() {
    console.log('haha');
  }
  //  停止，也会销毁所有的插件
  public stop() {
    this.emit(PluginApi.destroy, {});
    this.plugins.length = 0;
  }
  use(plugin: any) {
    const p = new plugin(this.instance);
    if (!this.config.skipPlugins?.includes(p.key) && p?.key) {
      p.install(this.instance);
      this.plugins.push(p);
    }
  }

  // 默认会携带 user 数据
  format(data: EventData[]) {
    return {
      userData: this.userData,
      data,
    };
  }
  // 立即发送数据，注意和 lazySend 的差异
  send(data: EventData[]) {
    // console.log('请求接口，发送数据', data);
    this.sender.send(this.format(data));
  }
  // 延迟合并发送数据
  lazySend(data: EventData, timeout?: number) {
    this.dataCache.addCache(data);
    this.lazy.listenerHandle(() => {
      const data = this.dataCache.getCache();
      if (data.length) {
        this.send(data);
        this.dataCache.clearCache();
      }
    }, timeout ?? this.lazySengTimeout);
  }
  setUserData(data: any) {
    this.userData = data;
  }
  emitListener(type: string, val: any) {
    this.listenerEmit.emit(type, val);
  }

  // 启用监听
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    window.addEventListener(type, listener, options);
    // 手动触发，便于测试
    this.listenerEmit.useSubscription(type, listener as any);
  }

  // 取消监听
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions | undefined,
  ): void {
    window.removeEventListener(type, listener, options);
  }
}
