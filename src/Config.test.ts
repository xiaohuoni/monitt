import { describe, expect, it, vi } from 'vitest';
import { Config } from './Config';

describe('config', () => {
  it('normal', () => {
    const config = new Config({ url: 'vtest' });
    expect(config.url).toBe('vtest');
    config.setConfig('url', 'vitest');
    config.setConfig('xxx', 'vitest');
    expect(config.url).toBe('vitest');
  });
});
