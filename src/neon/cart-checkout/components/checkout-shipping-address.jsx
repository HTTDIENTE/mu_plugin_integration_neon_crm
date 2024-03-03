import { AddressCard } from '../../../global/components/forms/fields/address-card';
import { CartContext } from '../../../global/contexts/cart-context';

export function CheckoutShippingAddress() {
	return (
		<div className="checkout__shipping-address">
			<h2 className="checkout__title">Shipping Address</h2>
			<AddressCard
				className="checkout-shipping-address-form"
				context={ CartContext }
				type="shipping"
			/>
		</div>
	);
}
