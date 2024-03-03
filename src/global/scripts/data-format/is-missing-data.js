export const isMissingData = ( data ) => {
	if ( !! data.primaryContact && !! data.primaryContact.addresses[ 0 ] ) {
		[ 'lastName', 'firstName', 'email1' ].forEach( ( key ) => {
			if ( ! data.primaryContact[ key ] ) {
				return true;
			}
		} );
		[ 'addressLine1', 'city', 'stateProvince', 'zipCode' ].forEach(
			( key ) => {
				if ( ! data.primaryContact.addresses[ 0 ][ key ] ) {
					return true;
				}
			}
		);
	} else {
		return true;
	}
	return false;
};
