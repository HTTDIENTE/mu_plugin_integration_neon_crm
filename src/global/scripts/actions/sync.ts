import { apiNeon } from '../api';
import {
	getDates,
	setAccount, setDate,
	setDates,
	setEvents,
	setLiveStreams,
	setOrders,
	setProducts,
	setRecurringDonations,
} from '../storage';
import { Groups } from '../../constants';

function updateStorage( {
	data: {
		account,
		dates,
		orders,
		products,
		recurringDonations,
		events,
		livestream,
	},
} ) {
	if ( typeof account !== 'undefined' ) {
		setAccount( account );
		setDate( Groups.ACCOUNT );
	}
	if ( typeof orders !== 'undefined' ) {
		setOrders( orders );
		setDate( Groups.ORDERS );
	}
	if ( typeof dates !== 'undefined' ) {
		setDates( dates );
	}
	if ( typeof recurringDonations !== 'undefined' ) {
		setRecurringDonations( recurringDonations );
		setDate( Groups.RECURRING_DONATIONS );
	}
	if ( typeof products !== 'undefined' ) {
		setProducts( products );
		setDate( Groups.PRODUCTS );
	}
	if ( typeof events !== 'undefined' ) {
		setEvents( events );
		setDate( Groups.EVENTS );
	}
	if ( typeof livestream !== 'undefined' ) {
		setLiveStreams( livestream );
		setDate( Groups.LIVESTREAMS );
	}
}

export async function sync() {
	try {
		const response = await apiNeon( 'sync', getDates(), 'POST' );
		updateStorage( response );
	} catch ( error ) {
		if ( error.data.errors.code === 'post_sync_sync_failed' ) {
			document.getElementById( 'logout-btn' ).click();
		}
	}
}
