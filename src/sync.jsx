import { sync } from './global/scripts/actions/sync';

sync().finally( () => setInterval( sync, 1000 * 60 * 5 ) );
