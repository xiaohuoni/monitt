type Subscription<T> = (val: T) => void;

export class Emit {
  constructor() {}
  public subscriptions = {};

  public emit = (type: string, val: any) => {
    if (!this.subscriptions[type]) {
      this.subscriptions[type] = new Set<Subscription<any>>();
    }
    for (const subscription of this.subscriptions[type]) {
      subscription(val);
    }
  };

  public useSubscription = (type: string, callback: Subscription<any>) => {
    function subscription(val: any) {
      if (callback) {
        callback(val);
      }
    }
    if (!this.subscriptions[type]) {
      this.subscriptions[type] = new Set<Subscription<any>>();
    }
    this.subscriptions[type].add(subscription);
  };
}
