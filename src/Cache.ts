import clone from 'lodash.clonedeep';
import { getItem, setItem, removeItem } from './utils/Storage';
import { EventData } from './EventData';

export class DataCache {
  cache: EventData[] = [];
  constructor() {
    // 初始化的时候取出缓存
    this.cache = getItem();
  }
  getCache() {
    return clone(this.cache);
  }
  addCache(data: EventData) {
    this.cache.push(data);
    setItem(this.cache);
  }

  clearCache() {
    this.cache.length = 0;
    removeItem();
  }
}
