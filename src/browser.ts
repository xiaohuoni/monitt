import { Monitor } from './Monitor';
import { ClickPlugin } from './plugins/ClickPlugin';

const monitt = new Monitor();
monitt.use(ClickPlugin);
monitt.run();
export default monitt;
