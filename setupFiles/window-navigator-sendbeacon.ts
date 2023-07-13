import { afterAll, beforeAll, vi } from 'vitest';

const IntersectionObserverMock = {
  ...window.navigator,
  sendBeacon: (url: string, data: any) => {
    console.log(url);
    console.log(data);
    return true;
  },
};

vi.stubGlobal('navigator', IntersectionObserverMock);
