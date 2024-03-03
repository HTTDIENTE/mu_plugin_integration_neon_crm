import { AccountFormLoader } from './account-form-loader';
import { useIsLoggedIn } from '../../../global/hooks/use-is-logged-in';
import { AccountTabsLoader } from './account-tabs-loader';

export function App() {
	const [ isLoggedIn ] = useIsLoggedIn();

	return (
		<>
			{ isLoggedIn && (
				<div className="account">
					<h1 className="account__title">Account App</h1>
					<AccountTabsLoader />
					<AccountFormLoader />
				</div>
			) }
			{ ! isLoggedIn && (
				<div className="registration">
					<h2 className="registration__title">Registration Form</h2>
					<AccountFormLoader />
				</div>
			) }
		</>
	);
}
