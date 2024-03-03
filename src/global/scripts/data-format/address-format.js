export const addressFormat = ( address ) => {
	return [
		address?.addressLine1,
		address?.city,
		address?.stateProvince?.code,
		address?.zipCode,
	].join( ', ' );
};
