import { Form, InputNumber } from 'antd';
import { useState } from '@wordpress/element';
import moment from 'moment/moment';
import { Submit } from '../../../global/components/forms/fields/submit';
import { apiNeon } from '../../../global/scripts/api';
import { setDate, setOrders } from '../../../global/scripts/storage';
import Preloader from '../../../global/components/preloader';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';

function formatDataForNeon( event, values ) {
	return {
		eventId: event.id,
		registrationDateTime: moment().utc().format(),
		numberOfTickets: values.tickets,
	};
}

export function EventRegistrationForm( { messageApi, event } ) {
	const [ form ] = Form.useForm();
	const [ tickets, setTickets ] = useState( 1 );
	const [ preloader, setPreloader ] = useState( false );

	const onSubmit = async ( values ) => {
		setPreloader( true );

		try {
			const response = await apiNeon(
				'event-registrations',
				formatDataForNeon( event, values ),
				'POST'
			);

			setOrders( response.data.orders );
			setDate( 'orders' );

			messageApi.open( { type: 'success', content: 'Success!' } );
			setPreloader( false );
			window.location = global.neon.pages.thankYouPage;
		} catch ( error ) {
			ShowErrors( error, messageApi );
			setPreloader( false );
		}
	};

	return (
		<>
			{ preloader && <Preloader /> }
			<Form
				form={ form }
				onFinish={ onSubmit }
				initialValues={ { tickets } }
				className="event-registration-form"
			>
				<div className="form-footer">
					<div className="form-footer__item">
						<Form.Item name={ [ 'tickets' ] } label="Tickets:">
							<InputNumber
								id={ `event-${ event.id }-tickets` }
								min={ 1 }
								value={ tickets }
								onChange={ ( value ) => setTickets( value ) }
							/>
						</Form.Item>
					</div>
					<div className="form-footer__item">
						<Submit buttonTitle="Register" />
					</div>
				</div>
			</Form>
		</>
	);
}
