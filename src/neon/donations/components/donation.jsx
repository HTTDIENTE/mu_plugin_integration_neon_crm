import { Form, message } from 'antd';
import { useState } from '@wordpress/element';
import { DonationAmountForm } from './donation-amount-form';
import { DonationPaymentForm } from './donation-payment-form';

export default function Donation() {
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ donationData, setDonationData ] = useState( {
		amount: null,
	} );
	const [ amountForm ] = Form.useForm();

	return (
		<div className="donation">
			{ contextHolder }
			<div className="donation__forms">
				<DonationAmountForm
					donationData={ donationData }
					setDonationData={ setDonationData }
					amountForm={ amountForm }
				/>
				<DonationPaymentForm
					messageApi={ messageApi }
					donationData={ donationData }
					amountForm={ amountForm }
				/>
			</div>
		</div>
	);
}
