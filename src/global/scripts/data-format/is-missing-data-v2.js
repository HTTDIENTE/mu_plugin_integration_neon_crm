export const isMissingDataV2 = ( names, address ) => {
	if ( names && address ) {
		if ( names ) {
			[ 'lastName', 'firstName' ].forEach( ( key ) => {
				if ( ! names[ key ] ) {
					return true;
				}
			} );
		}
		if ( address ) {
			[ 'addressLine1', 'city', 'stateProvince', 'zipCode' ].forEach(
				( key ) => {
					if ( ! address[ key ] ) {
						return true;
					}
				}
			);
		}

		return false;
	}

	return true;
};
