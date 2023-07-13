# monitt

前端数据埋点 sdk

## 使用

```ts
import { Monitor, ClickPlugin, Config } from 'Monitt';

const config = new Config({ url: 'post url' });
const monitt = new Monitor(config);
monitt.use(ClickPlugin);
monitt.run();
```

## 插件机制

在调用 run 方法之前，调用插件注册

```ts
monitt.use(ClickPlugin);
monitt.use(OtherPlugin);
```

### 插件开发

插件需要继承自 Plugin 类，需要明确存在 `public key = 'click';` 和实现 `install` 方法。

在 Monitor.use 中加载插件时，会传入插件 api。因此在构造函数中需要需要传递 api 对象

```ts
  constructor(api: IApi) {
    super(api);
  }
```

以下是一个简单的插件例子，需要注意的是，写在 install 中的代码是立即执行的，使用 api.xx 则会在合适的生命周期中被执行，一般在 start 中做监听操作，需要在 destroy 中做取消监听。

```ts
import { type IApi, Plugin } from 'Monitt';

export class ClickPlugin extends Plugin {
  constructor(api: IApi) {
    super(api);
  }
  install(api: IApi) {
    api.start(() => {
      ['mousedown', 'touchstart'].forEach((eventType: string) => {
        window.addEventListener(eventType, this.handleClick);
      });
    });
    api.destroy((e) => {
      ['mousedown', 'touchstart'].forEach((eventType: string) => {
        window.removeEventListener(eventType, this.handleClick);
      });
    });
  }
}
```

handle 一般需要被延迟执行，所以可以使用 `this.listenerHandle` 的工具类处理

```ts
handleClick = (event: Event) => {
  this.listenerHandle(() => {
    const target = event.target;
    console.log(target);
    // 上报
    this.api.lazySend(
      new EventData({
        name: 'click',
        data: {},
      }),
    );
  });
};
```

`this.listenerHandle` 接收第二参数，表示防抖时间，默认为 500，比如在 500 ms 内用户持续点击按钮，最终只会触发一次

如果在监听函数中需要上报数据，可以使用 `this.api.lazySend`，它接受的数据是一个 `EventData`

### EventData

这个数据模型未确定，大概就是 5 个基本元素，来描述当前事件。可以参考神策数据的[数据模型](https://manual.sensorsdata.cn/sa/latest/%E6%95%B0%E6%8D%AE%E6%A8%A1%E5%9E%8B-108694645.html)

```ts
 {
	"distinct_id": "2b0a6f51a3cd6775",
	"time": 1434556935000,
	"type": "track",
	"anonymous_id": "2b0a6f51a3cd6775",
	"event": "PageView",
	"data": {
		"$ip" : "180.79.35.65",
		"user_agent" : "Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.）",
		"page_name" : "网站首页",
		"url" : "www.demo.com",
		"referer" : "www.referer.com"
	}
}
```

## 致谢

感谢 woai3c 提供的思路 https://github.com/woai3c/Front-end-articles/blob/master/monitor.md
