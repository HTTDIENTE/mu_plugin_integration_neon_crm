import { Drawer } from 'antd';
import { Checkout } from './checkout';
import { useContext } from '@wordpress/element';
import { CartContext } from '../../../global/contexts/cart-context';

export default function CheckoutPopup( { showCheckout, setShowCheckout } ) {
	const { cartItems } = useContext( CartContext );
	const isEmptyCart = ! cartItems.length;

	return (
		<Drawer
			title="Checkout"
			width="100%"
			rootClassName="checkout"
			onClose={ () => setShowCheckout( false ) }
			open={ showCheckout }
		>
			{ ! isEmptyCart && <Checkout /> }
			{ isEmptyCart && <p className="checkout__empty">Empty Cart</p> }
		</Drawer>
	);
}
