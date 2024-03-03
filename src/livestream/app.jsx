import { lazy, Suspense } from '@wordpress/element';
import moment from 'moment/moment';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppWrapper } from '../global/components/app-wrapper';
import { LivestreamNotFound } from './components/livestream-not-found';
import { useLiveStreams } from '../global/hooks/use-livestreams';

const LivestreamLazy = lazy( () =>
	import( /* webpackChunkName: "livestreams" */ './components/livestream' )
);

const LivestreamMonthLazy = lazy( () =>
	import( /* webpackChunkName: "livestreams-month" */ './components/livestream-month' )
);

export default function App() {
	const [ liveStreams ] = useLiveStreams();
	liveStreams.sort( ( a, b ) => {
		if (
			moment( a.publishDatetimeGMT ) >
			moment( b.publishDatetimeGMT )
		) {
			return 1;
		}
		if (
			moment( a.publishDatetimeGMT ) <
			moment( b.publishDatetimeGMT )
		) {
			return -1;
		}
		return 0;
	} );

	const router = createBrowserRouter(
		[
			{
				path: '/*',
				element: (
					<Suspense>
						<LivestreamLazy liveStreams={ liveStreams } />
					</Suspense>
				),
			},
			{
				path: '/archive/:year/:month',
				element: (
					<Suspense>
						<LivestreamMonthLazy liveStreams={ liveStreams } />
					</Suspense>
				),
				errorElement: <LivestreamNotFound />,
			},
		],
		{
			basename: global.livestream.pages.livestream,
		}
	);

	return (
		<>
			<AppWrapper>
				<RouterProvider router={ router } />
			</AppWrapper>
		</>
	);
}
