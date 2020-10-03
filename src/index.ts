import './configEnv';
import { sync } from './services/sums';

sync(true);
setInterval(sync, 5 * 60 * 1000);
