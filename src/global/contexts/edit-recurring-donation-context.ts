import { createContext } from '@wordpress/element';

// noinspection JSUnusedLocalSymbols
export const EditRecurringDonationContext = createContext( {
	editRecurringDonationId: '',
	setEditRecurringDonationId: ( editRecurringDonationId ) => {},
} );
