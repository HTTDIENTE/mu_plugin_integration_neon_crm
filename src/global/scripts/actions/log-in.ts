import { apiNeon } from '../api';
import { setAccount, setAuth, setDate, setOrders, setRecurringDonations } from '../storage';

const setNewUrl = () => {
	window.history.pushState( {}, 'Title', window.location.pathname );
};

export async function logIn() {
	const params = new URL( window.location.href ).searchParams;
	const authorizationCode = params.get( 'code' );

	if ( authorizationCode ) {
		try {
			const response = await apiNeon(
				'auth',
				{ authorizationCode },
				'POST'
			);
			setAccount( response.data.account );
			setOrders( response.data.orders );
			setRecurringDonations( response.data.recurringDonations );
			setAuth( response.data.auth );
			setDate( 'account' );
			setDate( 'orders' );
			setDate( 'recurringDonations' );
			setNewUrl();
		} catch ( error ) {
			// eslint-disable-next-line no-console
			console.log( 'Error', error );
		}
	}
}
