import { describe, expect, it, vi } from 'vitest';
import { EventData } from './EventData';

describe('cache', () => {
  it('normal', () => {
    const name = 'vitest';
    const data = new EventData({ name, data: {} });
    expect(data.name).toBe(name);
  });
});
