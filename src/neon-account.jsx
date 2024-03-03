import { initApp } from './global/scripts/init-app';
import { App } from './neon/account/skeletons/app';
import { Groups } from './global/constants';
import './neon/account/main.scss';

initApp(
	'.neon-account',
	() =>
		import(
			/* webpackChunkName: "neon-account-app" */ './neon/account/app'
		),
	[ Groups.AUTH ],
	<App />
);
