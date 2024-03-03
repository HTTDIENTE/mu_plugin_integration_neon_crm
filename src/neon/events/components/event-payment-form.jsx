import { Form, InputNumber } from 'antd';
import { useState } from '@wordpress/element';
import moment from 'moment/moment';
import { apiNeon } from '../../../global/scripts/api';
import { PaymentForm } from '../../../global/components/forms/payment-form';
import { priceFormat } from '../../../global/scripts/data-format/price-format';
import { setDate, setOrders } from '../../../global/scripts/storage';
import Preloader from '../../../global/components/preloader';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';

function formatDataForNeon( values, token, event, tickets ) {
	return {
		payments: [
			{
				tenderType: 4,
				receivedDate: moment().utc().format(),
				creditCardOnline: {
					token,
					cardHolderEmail: values.primaryContact.email1,
					billingAddress: {
						addressLine1:
							values.primaryContact.addresses[ 0 ].addressLine1,
						addressLine2:
							values.primaryContact.addresses[ 0 ].addressLine2,
						city: values.primaryContact.addresses[ 0 ].city,
						stateProvinceCode:
							values.primaryContact.addresses[ 0 ].stateProvince
								.code,
						countryId:
							values.primaryContact.addresses[ 0 ].country.id,
						zipCode: values.primaryContact.addresses[ 0 ].zipCode,
					},
				},
			},
		],
		eventId: event.id,
		registrationDateTime: moment().utc().format(),
		numberOfTickets: tickets,
	};
}

export function EventPaymentForm( { messageApi, event } ) {
	const [ tickets, setTickets ] = useState( 1 );
	const [ preloader, setPreloader ] = useState( false );

	const FooterEventPaymentForm = () => {
		return (
			<>
				<div className="form-footer__item">
					<Form.Item label="Tickets:" initialValue={ 1 }>
						<InputNumber
							id={ `event-${ event.id }-tickets` }
							min={ 1 }
							value={ tickets }
							onChange={ ( value ) => setTickets( value ) }
						/>
					</Form.Item>
					<div className="form-footer__row">
						<p className="form-footer__title">Ticket Price:</p>
						<p className="form-footer__value">
							{ priceFormat( event.fees ) }
						</p>
					</div>
					<div className="form-footer__row">
						<p className="form-footer__title">Total:</p>
						<p className="form-footer__value">
							{ priceFormat( tickets * event.fees ) }
						</p>
					</div>
				</div>
			</>
		);
	};

	async function onSubmitSuccess( { token, values } ) {
		setPreloader( true );
		try {
			const response = await apiNeon(
				'event-registrations',
				formatDataForNeon( values, token, event, tickets ),
				'POST'
			);
			setOrders( response.data.orders );
			setDate( 'orders' );

			setPreloader( false );
			messageApi.open( { type: 'success', content: response.message } );
			window.location = global.neon.pages.thankYouPage;
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
			<h3 className="event__form-title">Registration Form</h3>
			<PaymentForm
				formName="event-registration-form"
				onSubmitSuccess={ onSubmitSuccess }
				onSubmitError={ onSubmitError }
				buttonTitle="Register"
				formFooter={ <FooterEventPaymentForm /> }
			/>
		</>
	);
}
