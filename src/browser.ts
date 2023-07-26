import { Monitor } from './Monitor';
import { ClickPlugin } from './plugins/ClickPlugin';
import { AssetsErrorPlugin } from './plugins/AssetsErrorPlugin';
import { JSErrorPlugin } from './plugins/JSErrorPlugin';
import { PromiseErrorPlugin } from './plugins/PromiseErrorPlugin';
import { Config } from './Config';

const config = new Config({ url: 'posturl' });
const monitt = new Monitor(config);
monitt.use(ClickPlugin);
monitt.use(AssetsErrorPlugin);
monitt.use(JSErrorPlugin);
monitt.use(PromiseErrorPlugin);
monitt.run();
export default monitt;
