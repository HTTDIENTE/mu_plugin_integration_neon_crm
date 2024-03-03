let ready = 'not-init';
let currentId;
let lastId;
export let field;
export let neonPay;
const fields = {};
const errors = {};
const complete = {};

function getErrorMessage( id: string ): string {
	let errorMessage = '';

	if ( errors[ id ].invalid_card_number ) {
		errorMessage = errors[ id ].invalid_card_number;
	} else if ( errors[ id ].invalid_expiration_date ) {
		errorMessage = errors[ id ].invalid_expiration_date;
	} else if ( errors[ id ].invalid_card_cvc ) {
		errorMessage = errors[ id ].invalid_card_cvc;
	} else if ( ! complete[ id ].card_number ) {
		errorMessage = 'Card Number is required!';
	} else if ( ! complete[ id ].expiration_date ) {
		errorMessage = 'Card Expiration Date is required!';
	} else if ( ! complete[ id ].card_cvc ) {
		errorMessage = 'Card CVC is required!';
	}

	return errorMessage;
}

function resetField( id ) {
	fields[ id ].setValidateStatus( '' );
	fields[ id ].setHelp( '' );
	fields[ id ].setAlwaysUsed( false );
	complete[ id ] = {
		card_number: false,
		expiration_date: false,
		card_cvc: false,
	};
	errors[ id ] = {
		invalid_card_number: '',
		invalid_expiration_date: '',
		invalid_card_cvc: '',
	};
}

function validate( event ) {
	if ( event.error ) {
		errors[ currentId ][ event.error.type ] = event.error.message;
	} else {
		errors[ currentId ][ 'invalid_' + event.field ] = '';
		complete[ currentId ][ event.field ] = event.complete;
	}

	const errorMessage = getErrorMessage( currentId );
	fields[ currentId ].setValidateStatus( errorMessage ? 'error' : 'success' );
	fields[ currentId ].setHelp( errorMessage );
	fields[ currentId ].setCardComplete( ! errorMessage );
}

export function toggleV2( element ) {
	if ( element && element.classList.contains( 'float-label_used' ) ) {
		return;
	}

	const cardField = element.querySelector( '.payment-form__card' );

	currentId = '#' + cardField.id;

	if ( lastId ) {
		const lastElement = document.querySelector( lastId );
		if ( lastElement ) {
			field.unmountField( lastId );
			fields[ lastId ].setInitiated( false );
			fields[ lastId ].setCardComplete( false );

			field.mount( currentId );

			resetField( lastId );
		} else {
			field.mount( currentId );
		}
	} else {
		field.mount( currentId );
	}

	resetField( currentId );

	lastId = currentId;
	fields[ currentId ].setAlwaysUsed( true );
	fields[ currentId ].setInitiated( true );
	fields[ currentId ].setCardComplete( false );
}

export function setValidateStatus( id: string, status: string ) {
	fields[ '#' + id ].setValidateStatus( status );
}

export function setValidateHelp( id: string, help: string ) {
	fields[ '#' + id ].setHelp( help );
}

export async function paymentFormLoadV2(): Promise< {} > {
	return new Promise( ( resolve, reject ) => {
		if ( ready === 'not-init' ) {
			ready = 'progress';
			const script = document.createElement( 'script' );
			const head = document.getElementsByTagName( 'head' )[ 0 ];

			script.setAttribute( 'src', global.neon.payJsUrl );

			script.addEventListener( 'load', () => {
				neonPay = new global.NeonPay(
					global.neon.payApiKey,
					global.neon.merchantId
				);

				field = neonPay.createField( 'card', {
					style: {
						base: {
							color: '#000',
							fontFamily:
								"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'",
							fontSize: '14px',
							'::placeholder': {
								color: '#ccc',
							},
						},
						invalid: {
							color: '#ff4d4f',
						},
					},
					hideBorders: true,
					hidePostalCode: true,
				} );

				field.on( 'change', validate );

				ready = 'ready';
				resolve( fields );
			} );
			script.addEventListener( 'error', () => {
				ready = 'error';
				reject();
			} );

			head.appendChild( script );
		} else if ( ready === 'progress' ) {
			const intervalId = setInterval( () => {
				if ( 'ready' === ready ) {
					resolve( fields );
				} else if ( 'error' === ready ) {
					reject();
				} else {
					return;
				}

				clearInterval( intervalId );
			}, 100 );
		} else if ( ready === 'error' ) {
			reject();
		} else {
			resolve( fields );
		}
	} );
}
