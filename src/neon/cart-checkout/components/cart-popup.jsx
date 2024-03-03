import { useContext, useEffect } from '@wordpress/element';
import { Drawer } from 'antd';
import { CartItem } from './cart-item';
import { priceFormat } from '../../../global/scripts/data-format/price-format';
import { CartContext } from '../../../global/contexts/cart-context';

let first = true;

export default function CartPopup( {
	openCart,
	setOpenCart,
	setShowCheckout,
} ) {
	const { cartItems, subTotal } = useContext( CartContext );
	const isEmptyCart = ! cartItems.length;

	useEffect( () => {
		if ( ! first && ! isEmptyCart ) {
			setOpenCart( true );
		}
		first = false;
	}, [ cartItems ] );

	const Footer = () => {
		return (
			<>
				<div className="cart__total">
					<p>SubTotal:</p>
					<p>{ priceFormat( subTotal ) }</p>
				</div>
				<button
					className="btn"
					onClick={ () => setShowCheckout( true ) }
				>
					Checkout
				</button>
			</>
		);
	};

	return (
		<Drawer
			title="Cart"
			placement="right"
			size="small"
			rootClassName="cart"
			onClose={ () => setOpenCart( false ) }
			open={ openCart }
			footer={ ! isEmptyCart && <Footer /> }
		>
			{ cartItems.map( ( product, index ) => (
				<CartItem product={ product } key={ index } />
			) ) }

			{ isEmptyCart && <p className="cart__empty">Empty Cart</p> }
		</Drawer>
	);
}
