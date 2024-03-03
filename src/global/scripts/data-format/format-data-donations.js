import moment from 'moment/moment';

export function formatDataOneTimeDonat( token, values, donationData ) {
	return {
		date: moment().utc().format(),
		amount: +donationData.amount,
		payments: [
			{
				amount: +donationData.amount,
				tenderType: 4,
				receivedDate: moment().utc().format(),
				...formatDataCreditCardOnline( token, values ),
			},
		],
	};
}

export function formatDataRecurringDonat( token, values, donationData ) {
	return {
		recurringPeriod: 1,
		recurringPeriodType: donationData.frequency.toUpperCase(),
		amount: +donationData.amount,
		nextDate: moment().add( 1, 'days' ).utc().format(),
		...formatDataCreditCardOnline( token, values ),
	};
}

export function formatDataCreditCardOnline( token, values ) {
	return {
		creditCardOnline: {
			token,
			cardHolderEmail: values.primaryContact.email1,
			billingAddress: {
				addressLine1: values.primaryContact.addresses[ 0 ].addressLine1,
				addressLine2: values.primaryContact.addresses[ 0 ].addressLine2,
				city: values.primaryContact.addresses[ 0 ].city,
				stateProvinceCode:
				values.primaryContact.addresses[ 0 ].stateProvince.code,
				countryId: values.primaryContact.addresses[ 0 ].country.id,
				zipCode: values.primaryContact.addresses[ 0 ].zipCode,
			},
		},
	};
}
