import { describe, expect, it, vi } from 'vitest';
import { getItem, setItem, removeItem } from './Storage';
describe('storage', () => {
  it('normal', () => {
    const data = { type: 'storage' };
    setItem(data);
    const d = getItem();
    expect(d.type).toBe('storage');
    removeItem();
    const d2 = getItem();
    expect(d2.type).toBe(undefined);
  });
  it('key', () => {
    const key = 'abc';
    const data = { type: 'storage' };
    setItem(data, key);
    const d = getItem('12312');
    expect(d.type).toBe(undefined);
    const d2 = getItem(key);
    expect(d2.type).toBe('storage');
  });
  it('key', () => {
    const key = 'abc';
    const data = { type: 'storage' };
    setItem(JSON.stringify(data), key);
    const d = getItem('12312');
    expect(d.type).toBe(undefined);
    const d2 = getItem(key);
    expect(d2.type).toBe('storage');
  });
});
