import { ConfigProps } from './Config';

export function isSupportSendBeacon() {
  return !!window.navigator?.sendBeacon;
}

export class Sender {
  url?: string;
  sendBeacon;
  constructor({ url }: ConfigProps) {
    this.url = url;
    function reportWithXHR(data: any) {
      const xhr = new XMLHttpRequest();
      xhr.open('post', url!);
      xhr.send(JSON.stringify(data));
    }
    const sendBeaconDefault = isSupportSendBeacon()
      ? window.navigator.sendBeacon.bind(window.navigator)
      : reportWithXHR;
    this.sendBeacon = sendBeaconDefault;
  }
  setSendBeacon(beacon: any) {
    this.sendBeacon = beacon;
  }
  send(data, isImmediate?: boolean) {
    console.log(data);
    if (isImmediate) {
      this.sendBeacon(this.url!, data);
      return;
    }

    if (window.requestIdleCallback) {
      window.requestIdleCallback(
        () => {
          this.sendBeacon(this.url!, data);
        },
        { timeout: 3000 },
      );
    } else {
      setTimeout(() => {
        this.sendBeacon(this.url!, data);
      });
    }
  }
}
