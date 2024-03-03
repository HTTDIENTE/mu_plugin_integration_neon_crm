export function ShowErrors( error, messageApi ) {
	if ( error.data.errors && error.data.errors.length ) {
		error.data.errors.forEach( ( item, index ) => {
			setTimeout( () => {
				messageApi.open( { type: 'error', content: item.message, duration: 5 } );
			}, index * 500 );
		} );
	} else {
		messageApi.open( { type: 'error', content: error.message, duration: 5 } );
	}
}
