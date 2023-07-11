import { describe, expect, it, vi } from 'vitest';
import { DataCache } from './Cache';
import { EventData } from './EventData';

describe('cache', () => {
  it('normal', () => {
    const name = 'vitest';
    const data = new DataCache();
    data.addCache(new EventData({ name, data: {} }));
    const d = data.getCache();
    expect(d.length).toBe(1);
    const ed = d[0];
    expect(ed.name).toBe(name);
    data.clearCache();
  });
  it('clonedeep', () => {
    const name = 'vitest';
    const data = new DataCache();
    data.addCache(new EventData({ name, data: {} }));
    const d = data.getCache();
    expect(d.length).toBe(1);
    const ed = d[0];
    ed.name = 'haha';
    const d2 = data.getCache();
    expect(d2[0].name).toBe(name);
    data.clearCache();
  });
});
