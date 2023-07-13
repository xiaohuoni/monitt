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
    const fn = vi.fn((t) => (t[0] ? t[0].name : t));
    vi.spyOn(console, 'log').mockImplementation(fn);
    const monitt = new Monitor();
    monitt.use(ClickPlugin);
    monitt.run();
    // 手动调用监听事件
    monitt.emitListener('mousedown', {});
    vi.runAllTimers();
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveReturnedWith('click');
  });
});
