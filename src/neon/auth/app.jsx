import { useIsLoggedIn } from '../../global/hooks/use-is-logged-in';
import { AppWrapper } from '../../global/components/app-wrapper';
import { lazy, Suspense } from '@wordpress/element';

const LogOutButtonLazy = lazy( () =>
	import(
		/* webpackChunkName: "log-out-button" */ './components/LogOutButton'
	)
);

const LogInButtonLazy = lazy( () =>
	import( /* webpackChunkName: "log-in-button" */ './components/LogInButton' )
);

export function App() {
	const [ isLoggedIn ] = useIsLoggedIn();

	return (
		<AppWrapper>
			{ isLoggedIn && (
				<Suspense fallback={ '...' }>
					<LogOutButtonLazy />
				</Suspense>
			) }
			{ ! isLoggedIn && (
				<Suspense fallback={ '...' }>
					<LogInButtonLazy />
				</Suspense>
			) }
		</AppWrapper>
	);
}
