import {
	field,
	neonPay,
	setValidateHelp,
	setValidateStatus,
} from './payment-form-load-v2';

function formatDataForNeonPay( billingNames, billingAddress ) {
	return {
		first_name: billingNames.firstName,
		middle_name: billingNames.middleName,
		last_name: billingNames.lastName,
		phone: billingAddress.phone1.replace( / +/g, '' ),
		address_line_1: billingAddress.addressLine1,
		address_line_2: billingAddress.addressLine2,
		address_city: billingAddress.city,
		address_state: billingAddress.stateProvince.code,
		address_zip: billingAddress.zipCode,
		address_country: 'US', // todo set country
	};
}

export async function paymentFormOnFinishV2(
	cardFieldId: string,
	billingAddress,
	billingNames,
	onSubmitSuccess,
	onSubmitError
): Promise< void > {
	try {
		const tokenData = formatDataForNeonPay( billingNames, billingAddress );
		const result = await neonPay.createToken( field, tokenData );
		setValidateStatus( cardFieldId, 'success' );
		setValidateHelp( cardFieldId, 'success' );
		onSubmitSuccess( { token: result.token } );
	} catch ( errors ) {
		const help = [];
		for ( const key of Object.keys( errors ) ) {
			help.push( errors[ key ].message );
		}

		setValidateStatus( cardFieldId, 'error' );
		setValidateHelp( cardFieldId, help.join( ', ' ) );
		if ( onSubmitError ) {
			onSubmitError( errors );
		}
	}
}
