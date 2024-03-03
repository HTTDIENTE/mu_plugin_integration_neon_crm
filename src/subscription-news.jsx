import { News } from './neon/subscription/news';
import { initApp } from './global/scripts/init-app';
import { Groups } from './global/constants';
import './neon/subscription/main.scss';

initApp( '.subscription-news', News, [ Groups.AUTH ] );
