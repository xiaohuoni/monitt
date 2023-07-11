import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Lazy } from './Lazy';

describe('lazy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('listenerHandle', () => {
    const e = new Lazy();
    const fn = vi.fn();
    e.listenerHandle(fn, 50);
    // 2 ms
    vi.advanceTimersByTime(2);
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(50);
    // 等待所有 setTimeout 执行
    // vi.runAllTimers()
    expect(fn).toHaveBeenCalled();
  });
  it('lazy', () => {
    const e = new Lazy();
    const fn = vi.fn();
    // 调用 4 次
    e.listenerHandle(fn, 50);
    e.listenerHandle(fn, 50);
    e.listenerHandle(fn, 50);
    e.listenerHandle(fn, 50);
    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
