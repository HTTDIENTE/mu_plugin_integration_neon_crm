import { useEffect, useState } from '@wordpress/element';
import { getCartItems } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useCartItems() {
	const [ cartItems, setCartItems ] = useState( getCartItems() );

	useEffect( () => {
		return initializeObservationForStorage(
			cartItems,
			setCartItems,
			getCartItems,
			'cart'
		);
	} );

	return [ cartItems, setCartItems ];
}
