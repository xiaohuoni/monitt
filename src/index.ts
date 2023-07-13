import { Monitor, type IApi } from './Monitor';
import { Plugin } from './Plugin';
import { EventData } from './EventData';
import { Config } from './Config';
import { ClickPlugin } from './plugins/ClickPlugin';
import * as Storage from './utils/Storage';

export default Monitor;
export { Monitor, ClickPlugin, Plugin, EventData, Storage, IApi, Config };
