import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IApi, Monitor } from './Monitor';
import { Plugin } from './Plugin';

describe('lazy', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('install', () => {
    const fn = vi.fn((t) => t);
    vi.spyOn(console, 'log').mockImplementation(fn);
    class Vt extends Plugin {
      public key = 'Vt';
      constructor(api) {
        super(api);
      }
      install(api: IApi): void {
        console.log('use plugin install');
      }
    }
    const monitt = new Monitor();
    monitt.use(Vt);
    monitt.run();
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveReturnedWith('use plugin install');
  });
});
