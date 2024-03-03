import { EditRecurringDonatForms } from './edit-recurring-donat-forms';
import { useContext } from '@wordpress/element';
import { EditRecurringDonationContext } from '../../../global/contexts/edit-recurring-donation-context';

export function EditRecurringDonat( { donat, messageApi } ) {
	const { editRecurringDonationId, setEditRecurringDonationId } = useContext(
		EditRecurringDonationContext
	);

	const editDonationClick = () => {
		setEditRecurringDonationId( donat.id );
	};
	const cancelEditDonationClick = () => {
		setEditRecurringDonationId( '' );
	};

	return (
		<>
			{ editRecurringDonationId !== donat.id && (
				<button
					className="recurring-donat__button"
					onClick={ editDonationClick }
					disabled={ !! editRecurringDonationId }
				>
					Edit Recurring Donation
				</button>
			) }
			{ editRecurringDonationId === donat.id && (
				<>
					<button
						className="recurring-donat__button"
						onClick={ cancelEditDonationClick }
					>
						Cancel
					</button>
					<EditRecurringDonatForms
						donat={ donat }
						messageApi={ messageApi }
					/>
				</>
			) }
		</>
	);
}
