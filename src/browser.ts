import { Monitor } from './Monitor';
import { ClickPlugin } from './plugins/ClickPlugin';
import { Config } from './Config';

const config = new Config({ url: 'posturl' });
const monitt = new Monitor(config);
monitt.use(ClickPlugin);
monitt.run();
export default monitt;
