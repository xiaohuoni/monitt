export class Lazy {
  constructor() {}
  timer = 0;
  listenerHandle(callback: Function, timeout = 500) {
    clearTimeout(this.timer);
    this.timer = setTimeout(callback, timeout);
    return this.timer;
  }
}
