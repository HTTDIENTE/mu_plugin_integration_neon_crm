import { Groups } from './global/constants';
import { initApp } from './global/scripts/init-app';
import { App } from './neon/online-store/skeletons/app';
import './neon/online-store/styles/main.scss';

initApp(
	'.neon-online-store',
	() =>
		import(
			/* webpackChunkName: "neon-online-store-app" */ './neon/online-store/app'
		),
	[ Groups.SYNC ],
	<App />
);
