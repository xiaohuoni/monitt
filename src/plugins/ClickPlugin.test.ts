import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Monitor } from '../Monitor';
import { ClickPlugin } from './ClickPlugin';

describe('Monitor', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('install', () => {
    let callData: any = null;
    const fn = vi.fn((t, data) => {
      callData = data;
      return t;
    });
    vi.spyOn(console, 'log').mockImplementation(fn);
    const monitt = new Monitor();
    const clickP = new ClickPlugin(monitt.instance as any);
    clickP.install(monitt.instance as any);
    monitt.run();
    clickP.handleClick({} as any);
    vi.runAllTimers();
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveReturnedWith('请求接口，发送数据');
    expect(callData[0].name).toBe('click');
  });
});
