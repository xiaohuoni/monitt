import { describe, expect, it, vi } from 'vitest';
import { Emit } from './Emit';
describe('emit', () => {
  it('useSubscription', () => {
    const e = new Emit();
    const fn = vi.fn();
    e.useSubscription('vitest', fn);
    expect(e.subscriptions['vitest'].size).toBe(1);
  });
  it('emit', () => {
    const e = new Emit();
    const fn = vi.fn((t) => t);
    e.useSubscription('vitest', fn);
    e.emit('vitest', 123);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveReturnedWith(123);
  });
  it('extends', () => {
    class VEmit extends Emit {
      constructor() {
        super();
      }
    }
    const e = new VEmit();
    const fn = vi.fn((t) => t);
    e.useSubscription('vitest', fn);
    e.emit('vitest', 123);
    expect(fn).toHaveBeenCalled();
    expect(fn).toHaveReturnedWith(123);
  });
});
