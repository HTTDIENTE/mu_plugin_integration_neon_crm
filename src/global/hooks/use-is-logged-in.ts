import { useEffect, useState } from '@wordpress/element';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';
import { getAuth } from '../scripts/storage';

export function useIsLoggedIn() {
	const [ isLoggedIn, setIsLoggedIn ] = useState( getAuth().isLoggedIn );

	useEffect( () => {
		return initializeObservationForStorage(
			isLoggedIn,
			setIsLoggedIn,
			() => getAuth().isLoggedIn,
			'auth'
		);
	} );

	return [ isLoggedIn, setIsLoggedIn ];
}
