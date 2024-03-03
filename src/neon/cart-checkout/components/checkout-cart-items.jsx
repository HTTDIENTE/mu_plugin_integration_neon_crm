import { CartItem } from './cart-item';
import { priceFormat } from '../../../global/scripts/data-format/price-format';
import { useContext } from '@wordpress/element';
import { CartContext } from '../../../global/contexts/cart-context';

export function CheckoutCartItems() {
	const { cartTotal, cartItems, subTotal } = useContext( CartContext );

	return (
		<>
			<div className="checkout__cart-items">
				<h2 className="checkout__title">Cart Items</h2>
				{ cartItems.map( ( product, index ) => (
					<CartItem product={ product } key={ index } checkout />
				) ) }
				<div className="checkout__total">
					<p>SubTotal:</p>
					<p>{ priceFormat( subTotal ) }</p>
				</div>
				{ !! cartTotal.shippingHandlingFee && (
					<div className="checkout__total">
						<p>Shipping:</p>
						<p>{ priceFormat( cartTotal.shippingHandlingFee ) }</p>
					</div>
				) }
				{ !! cartTotal.tax && (
					<div className="checkout__total">
						<p>Tax:</p>
						<p>{ priceFormat( cartTotal.tax ) }</p>
					</div>
				) }
				{ Number( cartTotal.totalCharge ) >= 0 && (
					<div className="checkout__total">
						<p>Total:</p>
						<p>{ priceFormat( cartTotal.totalCharge ) }</p>
					</div>
				) }
			</div>
		</>
	);
}
