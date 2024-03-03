import { useEffect, useState } from '@wordpress/element';
import { getShippingMethods } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useShippingMethods() {
	const [ shippingMethods, setShippingMethods ] = useState(
		getShippingMethods()
	);

	useEffect( () => {
		return initializeObservationForStorage(
			shippingMethods,
			setShippingMethods,
			getShippingMethods,
			'shippingMethods'
		);
	} );

	return [ shippingMethods, setShippingMethods ];
}
