import { useIsLoggedIn } from '../../global/hooks/use-is-logged-in';
import { lazy, Suspense } from '@wordpress/element';
import { AppWrapper } from '../../global/components/app-wrapper';

const AccountLazy = lazy( () =>
	import( /* webpackChunkName: "account-form" */ './components/account' )
);

const RegistrationLazy = lazy( () =>
	import(
		/* webpackChunkName: "registration-form" */ './components/registration'
	)
);

export default function App() {
	const [ isLoggedIn ] = useIsLoggedIn();

	return (
		<AppWrapper>
			{ isLoggedIn && (
				<Suspense>
					<AccountLazy />
				</Suspense>
			) }
			{ ! isLoggedIn && (
				<Suspense>
					<RegistrationLazy app={ 'account' } />
				</Suspense>
			) }
		</AppWrapper>
	);
}
