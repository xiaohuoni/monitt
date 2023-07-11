import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { IApi, Monitor } from './Monitor';
import { EventData } from './EventData';
import { Plugin } from './Plugin';

describe('Monitor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('normal', () => {
    const name = 'vitest';
    const data = new EventData({ name, data: {} });
    const fn = vi.fn();
    vi.spyOn(console, 'log').mockImplementation(fn);
    const monitt = new Monitor();
    monitt.run();
    monitt.lazySend(data);
    monitt.lazySend(data);
    monitt.lazySend(data);
    monitt.lazySend(data);
    monitt.lazySend(data);
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });
  it('haha', () => {
    const fn = vi.fn((t) => t);
    vi.spyOn(console, 'log').mockImplementation(fn);
    const monitt = new Monitor();
    monitt.haha();
    expect(fn).toHaveReturnedWith('haha');
  });
  it('plugins', () => {
    const fn = vi.fn((t) => t);
    vi.spyOn(console, 'log').mockImplementation(fn);
    class Vt extends Plugin {
      public key = 'Vt';
      constructor(api) {
        super(api);
      }
      install(api: IApi): void {
        console.log('Vt');
      }
    }

    const monitt = new Monitor();
    monitt.use(Vt);
    monitt.run();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveReturnedWith('Vt');
  });
  it('plugins api', () => {
    const fn = vi.fn((t) => t);
    const errorFn = vi.fn((t) => t);
    vi.spyOn(console, 'log').mockImplementation(fn);
    vi.spyOn(console, 'error').mockImplementation(errorFn);
    class Vt extends Plugin {
      public key = 'Vt';
      constructor(api) {
        super(api);
      }
      install(api: IApi): void {
        api.start(() => {
          console.log('Vt start');
        });
        api.destroy(() => {
          console.log('Vt destroy');
        });
      }
    }

    const monitt = new Monitor();
    monitt.use(Vt);
    monitt.run();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveReturnedWith('Vt start');
    monitt.stop();
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveReturnedWith('Vt destroy');
    // 这个 api 不存在，所以会走 other
    // @ts-ignore
    monitt.instance.hahaha();
    expect(errorFn).toHaveReturnedWith('hahaha 方法未定义');
  });
  it('other api', () => {
    const fn = vi.fn((t) => t);
    vi.spyOn(console, 'log').mockImplementation(fn);
    class Vt extends Plugin {
      public key = 'Vt';
      constructor(api) {
        super(api);
      }
      handle() {
        const name = 'vitest';
        const data = new EventData({ name, data: {} });
        this.api.lazySend(data);
      }
      install(api: IApi): void {
        api.start(() => {
          this.handle();
        });
      }
    }

    const monitt = new Monitor();
    monitt.use(Vt);
    monitt.run();
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveReturnedWith('请求接口，发送数据');
  });
});
