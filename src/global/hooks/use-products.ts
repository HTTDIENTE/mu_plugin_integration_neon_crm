import { useEffect, useState } from '@wordpress/element';
import { getProducts } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useProducts() {
	const [ products, setProducts ] = useState( getProducts() );

	useEffect( () => {
		return initializeObservationForStorage(
			products,
			setProducts,
			getProducts,
			'products'
		);
	} );

	return [ products, setProducts ];
}
