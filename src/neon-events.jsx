import { App } from './neon/events/skeletons/app';
import { initApp } from './global/scripts/init-app';
import { Groups } from './global/constants';
import './neon/events/styles/main.scss';
import './neon/events/styles/event.scss';

initApp(
	'.neon-events',
	() =>
		import( /* webpackChunkName: "neon-events-app" */ './neon/events/app' ),
	[ Groups.EVENTS ],
	<App />
);
