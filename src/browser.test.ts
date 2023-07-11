import { describe, expect, it, vi } from 'vitest';

describe('cache', () => {
  it('normal', async () => {
    const { default: monitt } = await import('./browser');
    expect(monitt.plugins.length).toBe(1);
    monitt.stop();
  });
});
