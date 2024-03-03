import { apiNeon } from '../api';
import {
	delAccount,
	delAuth,
	delCartItems,
	delOrders,
	delRecurringDonations,
	delShippingMethods,
} from '../storage';

export async function logOut() {
	const params = new URL( window.location.href ).searchParams;
	const logout = params.get( 'logout' );

	if ( logout ) {
		try {
			await apiNeon( 'auth', null, 'DELETE' );
			delAccount();
			delAuth();
			delOrders();
			delRecurringDonations();
			delCartItems();
			delShippingMethods();
			window.history.pushState(
				'',
				document.title,
				window.location.pathname
			);
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.log( 'Error', error );
		}
	}
}
