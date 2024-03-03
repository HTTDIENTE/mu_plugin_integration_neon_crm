import { useEffect, useState } from '@wordpress/element';
import { getAccount } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useAccount() {
	const [ account, setAccount ] = useState( getAccount() );

	useEffect( () => {
		return initializeObservationForStorage(
			account,
			setAccount,
			getAccount,
			'account'
		);
	} );

	return [ account, setAccount ];
}
