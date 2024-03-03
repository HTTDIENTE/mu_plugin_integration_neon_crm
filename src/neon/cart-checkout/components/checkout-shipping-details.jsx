import { CheckoutShippingAddress } from './checkout-shipping-address';
import { CheckoutShippingOptions } from './checkout-shipping-options';
import { CheckoutShippingPayment } from './checkout-shipping-payment';
import { useState } from '@wordpress/element';

export function CheckoutShippingDetails() {
	const [ isCurrent, setCurrentStep ] = useState( {
		options: false,
		payment: false,
	} );

	return (
		<div className="checkout__shipping-details">
			<CheckoutShippingAddress />
			<CheckoutShippingOptions
				isCurrent={ isCurrent }
				setCurrentStep={ setCurrentStep }
			/>
			<CheckoutShippingPayment isCurrent={ isCurrent.payment } />
		</div>
	);
}
