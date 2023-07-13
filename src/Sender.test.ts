import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Sender } from './Sender';

describe('sender', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('normal', () => {
    const fn = vi.fn((url) => url);
    vi.spyOn(console, 'log').mockImplementation(fn);
    const sender = new Sender({ url: 'vitest' });
    sender.send([]);
    vi.runAllTimers();
    expect(fn).toHaveReturnedWith('vitest');
    sender.send([], true);
    expect(fn).toHaveReturnedWith('vitest');
  });
  it('setSendBeacon', () => {
    const fn = vi.fn((url) => url);
    const sender = new Sender({ url: 'vitest' });
    sender.setSendBeacon(fn);
    sender.send([]);
    vi.runAllTimers();
    expect(fn).toHaveReturnedWith('vitest');
    sender.send([], true);
    expect(fn).toHaveReturnedWith('vitest');
  });
  it('XMLHttpRequest', () => {
    const IntersectionObserverMock = {
      ...window.navigator,
      sendBeacon: null,
    };
    const fn = vi.fn((url) => url);
    vi.stubGlobal('navigator', IntersectionObserverMock);
    class XMLHttpRequestMock {
      open(method: string, url: string | URL) {
        fn(url);
      }
      send(data: string) {}
    }
    vi.stubGlobal('XMLHttpRequest', XMLHttpRequestMock);
    const sender = new Sender({ url: 'vitest' });
    sender.send([]);
    vi.runAllTimers();
    expect(fn).toHaveReturnedWith('vitest');
    vi.unstubAllGlobals();
    // 请求的测试应该交给 cypress
  });
  it('requestIdleCallback', () => {
    const fn = vi.fn((url) => url);
    const sender = new Sender({ url: 'vitest' });
    const requestIdleCallback = vi.fn((callball, option) => {
      const { timeout } = option;
      setTimeout(() => {
        callball();
      }, timeout);
    });
    sender.setSendBeacon(fn);
    vi.stubGlobal('requestIdleCallback', requestIdleCallback);
    sender.send([]);
    vi.runAllTimers();
    expect(fn).toHaveReturnedWith('vitest');
    vi.unstubAllGlobals();
  });
});
