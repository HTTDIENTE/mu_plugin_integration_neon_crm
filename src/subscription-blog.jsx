import { Blog } from './neon/subscription/blog';
import { initApp } from './global/scripts/init-app';
import { Groups } from './global/constants';
import './neon/subscription/main.scss';

initApp( '.subscription-blog', Blog, [ Groups.AUTH ] );
