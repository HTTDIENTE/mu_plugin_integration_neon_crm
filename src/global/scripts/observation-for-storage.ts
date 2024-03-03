import type { Dispatch, SetStateAction } from 'react';

export function initializeObservationForStorage< S >(
	oldState: S,
	setState: Dispatch< SetStateAction< S > >,
	getNewState: () => S,
	key: String
): () => void {
	const storage = ( event: StorageEvent ) => {
		if ( event.key === key || event.key === null ) {
			const newState = getNewState();
			if ( oldState !== newState ) {
				setState( newState );
			}
		}
	};

	window.addEventListener( 'storage', storage );

	return () => window.removeEventListener( 'storage', storage );
}
