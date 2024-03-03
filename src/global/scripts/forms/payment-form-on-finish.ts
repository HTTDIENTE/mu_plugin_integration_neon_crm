import { field, neonPay } from './payment-form-load';

function formatDataForNeonPay( values ) {
	return {
		first_name: values.primaryContact.firstName,
		middle_name: values.primaryContact.middleName,
		last_name: values.primaryContact.lastName,
		email: values.primaryContact.email1,
		phone: values.primaryContact.addresses[ 0 ].phone1.replace( / +/g, '' ),
		address_line_1: values.primaryContact.addresses[ 0 ].addressLine1,
		address_line_2: values.primaryContact.addresses[ 0 ].addressLine2,
		address_city: values.primaryContact.addresses[ 0 ].city,
		address_state: values.primaryContact.addresses[ 0 ].stateProvince.code,
		address_zip: values.primaryContact.addresses[ 0 ].zipCode,
		address_country: 'US', // todo set country
	};
}

export async function paymentFormOnFinish(
	cardFieldId: string,
	values,
	onSubmitSuccess,
	onSubmitError
): Promise< void > {
	try {
		const tokenData = formatDataForNeonPay( values );
		const result = await neonPay.createToken( field, tokenData );
		onSubmitSuccess( { token: result.token, values } );
	} catch ( errors ) {
		onSubmitError( errors );
	}
}
