import { useEffect, useState } from '@wordpress/element';
import { getEvents } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useEvents() {
	const [ events, setEvents ] = useState( getEvents() );

	useEffect( () => {
		return initializeObservationForStorage(
			events,
			setEvents,
			getEvents,
			'events'
		);
	} );

	return [ events, setEvents ];
}
