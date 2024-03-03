import { EditOutlined } from '@ant-design/icons';
import { lazy, Suspense } from '@wordpress/element';
import moment from 'moment/moment';
import { EventPaymentForm } from './event-payment-form';
import { EventRegistrationForm } from './event-registration-form';
import { useIsLoggedIn } from '../../../global/hooks/use-is-logged-in';

export default function EventRegistration( { event, messageApi } ) {
	const [ isLoggedIn ] = useIsLoggedIn();
	const RegistrationLazy = lazy( () =>
		import(
			/* webpackChunkName: "registration-form" */ './../../account/components/registration'
		)
	);

	const isRegistrationPeriod =
		event.registrationOpenDatetimeGMT < moment().utc().format() &&
		event.registrationCloseDatetimeGMT > moment().utc().format();
	const startRegister = moment( event.registrationOpenDatetimeGMT ).format(
		'DD MMM, YYYY LT'
	);
	const endRegister = moment( event.registrationCloseDatetimeGMT ).format(
		'DD MMM, YYYY LT'
	);

	return (
		<div className="event__registration">
			{ ! event.needRegister && (
				<p className="event__message">
					Registration is not required to participate in this event.
				</p>
			) }
			{ event.needRegister && (
				<>
					<p className="event__message">
						<EditOutlined />
						Registration is required to participate in this event.
					</p>
					<p className="event__message">
						Registration period for the event: { startRegister } -{ ' ' }
						{ endRegister }.
					</p>

					{ isLoggedIn && event.needPayment && isRegistrationPeriod && (
						<EventPaymentForm
							event={ event }
							messageApi={ messageApi }
						/>
					) }

					{ isLoggedIn && ! event.needPayment && isRegistrationPeriod && (
						<EventRegistrationForm
							event={ event }
							messageApi={ messageApi }
						/>
					) }

					{ ! isLoggedIn && (
						<Suspense>
							<RegistrationLazy app={ 'event' } />
						</Suspense>
					) }
				</>
			) }
		</div>
	);
}
