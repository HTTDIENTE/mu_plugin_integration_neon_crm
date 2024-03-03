import { DonationAmountFormLoader } from './donation-amount-form-loader';
import { DonationPaymentFormLoader } from './donation-payment-form-loader';
import { AccountFormLoader } from '../../account/skeletons/account-form-loader';
import { useIsLoggedIn } from '../../../global/hooks/use-is-logged-in';

export function App() {
	const [ isLoggedIn ] = useIsLoggedIn();

	return (
		<>
			{ isLoggedIn && (
				<>
					<h1 className="neon-donations__title">Donation</h1>
					<div className="donation">
						<div className="donation__forms">
							<DonationAmountFormLoader />
							<DonationPaymentFormLoader />
						</div>
					</div>
				</>
			) }
			{ ! isLoggedIn && (
				<div className="registration">
					<h2 className="registration__title">Registration Form</h2>
					<AccountFormLoader />
				</div>
			) }
		</>
	);
}
