import type { MessageInstance } from 'antd/es/message/interface';
import { apiNeon } from '../../../global/scripts/api';
import {
	setDate,
	setRecurringDonations,
} from '../../../global/scripts/storage';

export async function deleteRecurringDonation(
	donatId: string,
	messageApi: MessageInstance
) {
	try {
		const response = await apiNeon(
			'account/recurring-donations',
			donatId,
			'DELETE'
		);
		setRecurringDonations( response.data.recurringDonations );
		setDate( 'recurringDonations' );
		messageApi.open( {
			type: 'success',
			content: `Donation number #${ donatId } canceled`,
		} );
	} catch ( error ) {
		messageApi.open( {
			type: 'error',
			content: error.message,
		} );
	}
}
