import { useContext, useState } from '@wordpress/element';
import { EditRecurringDonationContext } from '../../../global/contexts/edit-recurring-donation-context';
import { apiNeon } from '../../../global/scripts/api';
import {
	setDate,
	setRecurringDonations,
} from '../../../global/scripts/storage';
import { PaymentForm } from '../../../global/components/forms/payment-form';
import Preloader from '../../../global/components/preloader';
import { formatDataRecurringDonat } from '../../../global/scripts/data-format/format-data-donations';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';

export function EditRecurringDonatPaymentForm( { donat, messageApi } ) {
	const [ preloader, setPreloader ] = useState( false );
	const { setEditRecurringDonationId } = useContext(
		EditRecurringDonationContext
	);

	async function onSubmitSuccess( { token, values } ) {
		setPreloader( true );

		try {
			const response = await apiNeon(
				'account/recurring-donations/payment',
				{
					...formatDataRecurringDonat( token, values, donat ),
					id: donat.id,
				},
				'PATCH'
			);
			setEditRecurringDonationId( '' );
			setRecurringDonations( response.data.recurringDonations );
			setDate( 'recurringDonations' );

			setPreloader( false );
			messageApi.open( { type: 'success', content: response.message } );
		} catch ( error ) {
			ShowErrors( error, messageApi );
			setPreloader( false );
		}
	}

	function onSubmitError( object ) {
		for ( const key of Object.keys( object ) ) {
			if ( key === 'message' ) {
				messageApi.open( {
					type: 'error',
					content: object[ key ],
				} );
			}
			if ( typeof object[ key ] === 'object' ) {
				onSubmitError( object[ key ] );
			}
		}
	}

	return (
		<>
			{ preloader && <Preloader /> }
			<section className="recurring-donat__forms_edit-payment">
				<h3 className="recurring-donat__form-title">
					Edit Payment Information
				</h3>
				<PaymentForm
					formName="edit-donation-payment-method"
					onSubmitSuccess={ onSubmitSuccess }
					onSubmitError={ onSubmitError }
				/>
			</section>
		</>
	);
}
