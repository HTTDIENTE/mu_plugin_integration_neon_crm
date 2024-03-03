import { useRecurringDonations } from '../../../global/hooks/use-recurring-donation';
import { RecurringDonat } from './recurring-donat';
import { message } from 'antd';
import { useState } from '@wordpress/element';
import { EditRecurringDonationContext } from '../../../global/contexts/edit-recurring-donation-context';

export default function RecurringDonations() {
	const [ recurringDonations ] = useRecurringDonations();
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ editRecurringDonationId, setEditRecurringDonationId ] =
		useState( '' );
	const isEmptyRecurringDonations = ! recurringDonations.length;

	return (
		<>
			{ contextHolder }
			<div className="recurring-donations">
				<h2 className="recurring-donations__title">
					Recurring Donations
				</h2>
				<EditRecurringDonationContext.Provider
					value={ {
						editRecurringDonationId,
						setEditRecurringDonationId,
					} }
				>
					{ recurringDonations.map( ( donat ) => (
						<RecurringDonat
							donat={ donat }
							key={ donat.id }
							messageApi={ messageApi }
						/>
					) ) }
				</EditRecurringDonationContext.Provider>
				{ isEmptyRecurringDonations && (
					<p className="recurring-donations__empty">
						Recurring Donations not found
					</p>
				) }
			</div>
		</>
	);
}
