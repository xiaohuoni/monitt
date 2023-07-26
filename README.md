# monitt

前端数据埋点 sdk

## 使用

```ts
import { Monitor, ClickPlugin, Config } from 'Monitt';

const config = new Config({ url: 'post url' });
const monitt = new Monitor(config);
monitt.use(ClickPlugin);
monitt.run();

// 可以把 monitt 放到 window 对象上，方便使用。
window.monitt = monitt;
```

需要注意的是 monitt 的功能取决于所使用的插件数量，以下文档仅表示最基本的知识。

## 配置

```js
const config = new Config({ ... });
```

new Config 时传入的为默认配置，后续都可以通过 `monitt.config.setConfig` 单独修改，如：

```js
monitt.config.setConfig('url', 'http://haha.com/api/v1/monite');
```

因为有时候 window.monitt 可能是通过 cdn 挂在进来的，此时已经完成了初始化过程，可以在 send 之前调用 set 方法，修改掉默认的配置和方法。

### url

post 发送的服务器地址，默认为空

### skipPlugins

支持跳过某些插件，可跳过内置插件和外部插件

## API 和功能概览

### config

new Config 对象，可以取到配置管理器

### userData

当前用户数据，会在每一次发送数据时携带，可以通过 setUserData 设置

### setUserData

设置当前用户数据

```js
monitt.setUserData({ id: '1123' });
```

### instance

插件机制的 api，也支持直接调用。

比如

```js
const monitt = new Monitor();
monitt.instance.destroy(() => {
  // 在 monitt stop 的时候做点啥
});
```

可以调用插件 api 的生命周期函数，其实每一次调用生命周期函数，都是注册一次监听。注意手动调用的时机，比如要调用 start ，要在 run 之前，否则是无效的。

### lazy

延迟执行方法集成对象，比如如果有个函数在 3 秒内只能调用一次

```js
const monitt = new Monitor();
const callback = () => {
  monitt.lazy.listenerHandle(() => {
    // 只会在停止调用 3 秒后执行
  }, 3000);
};
callback();
callback();
callback();
callback();
// 3000ms 后执行
```

### addEventListener

添加一个事件侦听器，比如监听鼠标点击

```js
const monitt = new Monitor();
monitt.addEventListener('mousedown', this.handleClick);
```

### removeEventListener

移除一个事件侦听器 ，比如移除监听鼠标点击

```js
const monitt = new Monitor();
monitt.removeEventListener('mousedown', this.handleClick);
```

## 内置插件

内置插件为默认监控行为，可通过 skipPlugins 配置关闭

### ClickPlugin

```js
type: click;
```

点击事件监听，会尝试判断被点击组件是否属于已知仓库。返回如下数据结构事件

```js
{
    "userData": {},
    "data": [
        {
            "name": "click",
            "timestamp": 1690275579678,
            "data": {
                "top": 10,
                "left": 8,
                "eventType": "mousedown",
                "pageHeight": 755,
                "scrollTop": 0,
                "target": "BUTTON",
                "startTime": 1731.2999999821186,
                "pageURL": "http://localhost:3000/",
                "outerHTML": "<button data-type=\"123\" class=\"ant-button ant-button1\">test</button>",
                "innerHTML": "test",
                "width": 37,
                "height": 22,
                "viewport": {
                    "width": 514,
                    "height": 755
                },
                "pkg": "antd",
                "type": "Button"
            }
        }
    ]
}
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

## 演示

https://click-xiaohuoni.vercel.app/ 当前支持收集点击时间，发给一个 404 路径

## 致谢

感谢 woai3c 提供的思路 https://github.com/woai3c/Front-end-articles/blob/master/monitor.md
