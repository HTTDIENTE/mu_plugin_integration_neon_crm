import { App } from './neon/auth/app';
import { initApp } from './global/scripts/init-app';
import { Groups } from './global/constants';
import './neon/auth/main.scss';

initApp( '.neon-auth', App, [ Groups.AUTH ] );
