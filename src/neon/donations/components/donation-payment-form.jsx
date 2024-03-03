import { apiNeon } from '../../../global/scripts/api';
import { PaymentForm } from '../../../global/components/forms/payment-form';
import { priceFormat } from '../../../global/scripts/data-format/price-format';
import {
	setDate,
	setRecurringDonations,
} from '../../../global/scripts/storage';
import { lazy, Suspense, useEffect, useState } from '@wordpress/element';
import Preloader from '../../../global/components/preloader';
import {
	formatDataOneTimeDonat,
	formatDataRecurringDonat,
} from '../../../global/scripts/data-format/format-data-donations';
import { useIsLoggedIn } from '../../../global/hooks/use-is-logged-in';

export function DonationPaymentForm( { messageApi, donationData, amountForm } ) {
	const [ preloader, setPreloader ] = useState( false );
	const [ isComplete, setIsComplete ] = useState( false );
	const [ isLoggedIn ] = useIsLoggedIn();

	const RegistrationLazy = lazy( () =>
		import(
			/* webpackChunkName: "registration-form" */ '../../../neon/account/components/registration'
		)
	);

	const AmountDonation = () => {
		return (
			<>
				<div className="form-footer__item">
					{ donationData.amount && (
						<>
							<h3 className="form-footer__title">Amount:</h3>
							<p className="form-footer__value">
								{ priceFormat( +donationData.amount ) }
							</p>
						</>
					) }
				</div>
				<div className="form-footer__item">
					{ donationData.type && (
						<>
							<h3 className="form-footer__title">
								Donation type:
							</h3>
							<p className="form-footer__value">
								{ donationData.frequency
									? `${ donationData.type.replace(
										'-',
										' '
									) } / ${ donationData.frequency }`
									: donationData.type.replace( '-', ' ' ) }
							</p>
						</>
					) }
				</div>
			</>
		);
	};

	useEffect( () => {
		if ( !! donationData.amount && donationData.amount > 0 && !! donationData.type ) {
			setIsComplete( true );
		} else {
			setIsComplete( false );
		}
	}, [ donationData ] );

	async function onSubmitSuccess( { token, values } ) {
		setPreloader( true );

		if ( ! isComplete ) {
			amountForm.validateFields();
			setPreloader( false );
		}

		if ( isComplete ) {
			const data =
				donationData.type === 'one-time'
					? formatDataOneTimeDonat( token, values, donationData )
					: formatDataRecurringDonat( token, values, donationData );

			const endpoint =
				donationData.type === 'one-time'
					? 'donations/one-time'
					: 'donations/recurring';

			try {
				const response = await apiNeon( endpoint, data, 'POST' );
				if ( response.data.recurringDonations ) {
					setRecurringDonations( response.data.recurringDonations );
					setDate( 'recurringDonations' );
				}

				setPreloader( false );
				messageApi.open( { type: 'success', content: response.message } );

				window.location =
					donationData.type === 'one-time'
						? global.neon.pages.oneTimeDonationThankYouPage
						: global.neon.pages.recurringDonationThankYouPage;
			} catch ( error ) {
				messageApi.open( { type: 'error', content: error.message } );
				setPreloader( false );
			}
		}
	}

	function onSubmitError( object ) {
		if ( amountForm ) {
			amountForm.validateFields();
		}

		function showError( obj ) {
			for ( const key of Object.keys( obj ) ) {
				if ( key === 'message' ) {
					messageApi.open( {
						type: 'error',
						content: obj[ key ],
					} );
				}
				if ( typeof obj[ key ] === 'object' ) {
					showError( obj[ key ] );
				}
			}
		}
		showError( object );
	}

	return (
		<>
			{ preloader && <Preloader /> }
			<section className="donation__payment-form">
				{ ! isLoggedIn && (
					<Suspense>
						<RegistrationLazy app={ 'donation' } />
					</Suspense>
				) }
				{ !! isLoggedIn && (
					<>
						<h3 className="donation__form-title">Payment Information</h3>
						<PaymentForm
							formName="donation-payment-method"
							onSubmitSuccess={ onSubmitSuccess }
							onSubmitError={ onSubmitError }
							buttonTitle="Donat Now"
							formFooter={ <AmountDonation /> }
							agreement={ true }
						/>
					</>
				) }
			</section>
		</>
	);
}
