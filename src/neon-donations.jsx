import { App } from './neon/donations/skeletons/app';
import { initApp } from './global/scripts/init-app';
import { Groups } from './global/constants';
import './neon/donations/styles/main.scss';
import './neon/donations/styles/donation.scss';

initApp(
	'.neon-donations',
	() =>
		import(
			/* webpackChunkName: "neon-account-app" */ './neon/donations/app'
		),
	[ Groups.AUTH ],
	<App />
);
