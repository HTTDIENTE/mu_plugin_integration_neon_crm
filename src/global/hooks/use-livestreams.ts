import { useEffect, useState } from '@wordpress/element';
import { getLiveStreams } from '../scripts/storage';
import { initializeObservationForStorage } from '../scripts/observation-for-storage';

export function useLiveStreams() {
	const [ liveStreams, setLiveStreams ] = useState( getLiveStreams() );

	useEffect( () => {
		return initializeObservationForStorage(
			liveStreams,
			setLiveStreams,
			getLiveStreams,
			'livestream'
		);
	} );

	return [ liveStreams, setLiveStreams ];
}
