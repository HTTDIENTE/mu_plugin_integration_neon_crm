import { AppWrapper } from '../../global/components/app-wrapper';
import { lazy, Suspense, useState } from '@wordpress/element';
import moment from 'moment/moment';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { EventNotFound } from './components/event-not-found';
import { CategoryNotFound } from './components/category-not-found';

const EventsLazy = lazy( () =>
	import( /* webpackChunkName: "events" */ './components/events' )
);

const EventLazy = lazy( () =>
	import( /* webpackChunkName: "event" */ './components/event' )
);

export default function App() {
	const [ months, setMonths ] = useState( moment() );
	const [ tab, setTab ] = useState( 'list' );
	const [ searchByValue, setSearchByValue ] = useState( null );

	const router = createBrowserRouter(
		[
			{
				path: '/*',
				element: (
					<Suspense>
						<EventsLazy
							months={ months }
							setMonths={ setMonths }
							tab={ tab }
							setTab={ setTab }
							searchByValue={ searchByValue }
							setSearchByValue={ setSearchByValue }
						/>
					</Suspense>
				),
			},
			{
				path: '/event/:eventId/',
				element: <EventLazy />,
				errorElement: <EventNotFound />,
			},
			{
				path: '/category/:categorySlug/',
				element: (
					<Suspense>
						<EventsLazy
							months={ months }
							setMonths={ setMonths }
							tab={ tab }
							setTab={ setTab }
							searchByValue={ searchByValue }
							setSearchByValue={ setSearchByValue }
						/>
					</Suspense>
				),
				errorElement: <CategoryNotFound />,
			},
		],
		{
			basename: global.neon.pages.events,
		}
	);

	return (
		<AppWrapper>
			<RouterProvider router={ router } />
		</AppWrapper>
	);
}
