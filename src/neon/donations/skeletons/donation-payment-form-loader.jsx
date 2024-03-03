import { PaymentFormLoader } from '../../../global/skeletons/payment-form-loader';
import ContentLoader from 'react-content-loader';

export const DonationPaymentFormLoader = () => {
	return (
		<div className="donation__payment-form">
			<h3 className="donation__form-title">Payment Information</h3>
			<PaymentFormLoader />
			<ContentLoader height="88" width="100%">
				<rect x="0" y="0" width="100%" height="88" />
			</ContentLoader>
		</div>
	);
};
