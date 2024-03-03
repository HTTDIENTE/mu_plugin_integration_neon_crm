import { useEffect, useState } from '@wordpress/element';
import { getOrders } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useOrders() {
	const [ orders, setOrders ] = useState( getOrders() );

	useEffect( () => {
		return initializeObservationForStorage(
			orders,
			setOrders,
			getOrders,
			'orders'
		);
	} );

	return [ orders, setOrders ];
}
