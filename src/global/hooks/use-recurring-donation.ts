import { useEffect, useState } from '@wordpress/element';
import { Groups } from '../constants';
import { getRecurringDonations } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useRecurringDonations() {
	const [ recurringDonations, setRecurringDonations ] = useState(
		getRecurringDonations()
	);

	useEffect( () => {
		return initializeObservationForStorage(
			recurringDonations,
			setRecurringDonations,
			getRecurringDonations,
			Groups.RECURRING_DONATIONS
		);
	} );

	return [ recurringDonations, setRecurringDonations ];
}
