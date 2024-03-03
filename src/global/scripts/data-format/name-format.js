export const nameFormat = ( name ) => {
	return [ name?.firstName, name?.middleName, name?.lastName ]
		.filter( ( item ) => item )
		.join( ' ' );
};
