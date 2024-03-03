import { useEffect } from '@wordpress/element';
import { useLocation } from 'react-router-dom';

export function useGaPageView() {
	const location = useLocation();
	useEffect( () => {
		if ( typeof global.ga !== 'undefined' ) {
			global.ga( 'send', 'pageview' );
		}
	}, [ location ] );
}
