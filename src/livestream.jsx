import { App } from './livestream/skeletons/app';
import { initApp } from './global/scripts/init-app';
import './livestream/main.scss';
import { Groups } from './global/constants';

initApp(
	'.livestream',
	() =>
		import(
			/* webpackChunkName: "neon-online-store-app" */ './livestream/app'
		),
	[ Groups.SYNC ],
	<App />
);
