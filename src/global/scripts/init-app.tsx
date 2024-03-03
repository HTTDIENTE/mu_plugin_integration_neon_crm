import { lazy, render, Suspense } from '@wordpress/element';
import { Groups } from '../constants';
import { logIn } from './actions/log-in';
import { logOut } from './actions/log-out';
import { sync } from './actions/sync';

const readyAuthSate = Promise.all( [ logIn(), logOut() ] );
const readySync = Promise.all( [ sync() ] );

type AppComponent =
	| JSX.Element
	| ( () => Promise< { readonly default: () => any } > );

function isFunctionComponent< T extends AppComponent >(
	component: T
): boolean {
	return (
		typeof component === 'function' &&
		String( component ).includes( '.createElement' )
	);
}

export function initApp(
	selectors: string,
	App: AppComponent,
	readyDependencies = [],
	Skeleton?: JSX.Element
) {
	const readyStates = [];
	readyDependencies.forEach( ( readyDependency ) => {
		switch ( readyDependency ) {
			case Groups.AUTH:
				readyStates.push( readyAuthSate );
				break;
			case Groups.SYNC:
				readyStates.push( readySync );
				break;
		}
	} );

	let RootApp;

	if ( isFunctionComponent( App ) ) {
		// noinspection JSUnusedAssignment
		RootApp = App;
	} else {
		const AppLazy = lazy( async () => {
			await Promise.all( readyStates );

			// @ts-ignore
			return App();
		} );

		// noinspection JSUnusedAssignment
		RootApp = () => (
			<>
				<Suspense fallback={ Skeleton }>
					<AppLazy />
				</Suspense>
			</>
		);
	}

	document.querySelectorAll( selectors ).forEach( ( rootElement ) => {
		render( <RootApp />, rootElement, () => {
			rootElement.className = rootElement.className.replace(
				'_loading',
				'_loaded'
			);
		} );
	} );
}
