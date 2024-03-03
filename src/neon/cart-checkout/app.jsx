import { lazy, Suspense, useEffect, useState } from '@wordpress/element';
import { Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { AppWrapper } from '../../global/components/app-wrapper';
import { CartWrapper } from './components/cart-wrapper';
import './styles/cart.scss';
import './styles/main.scss';

const CartPopupLazy = lazy( () =>
	import( /* webpackChunkName: "cart" */ './components/cart-popup' )
);

const CheckoutPopupLazy = lazy( () =>
	import( /* webpackChunkName: "checkout" */ './components/checkout-popup' )
);

export function App() {
	const [ openCart, setOpenCart ] = useState( false );
	const [ showCheckout, setShowCheckout ] = useState( false );

	useEffect( () => {
		if ( showCheckout ) {
			setOpenCart( false );
		}
	}, [ showCheckout ] );

	return (
		<AppWrapper>
			<CartWrapper>
				<Button
					type="link"
					onClick={ () => setShowCheckout( true ) }
					className="neon-cart-checkout__open-checkout"
				>
					Checkout
				</Button>
				<Button
					type="link"
					icon={ <ShoppingCartOutlined fill="#383838" /> }
					onClick={ () => setOpenCart( true ) }
					className="neon-cart-checkout__open-cart"
				/>
				<Suspense fallback={ null }>
					<CartPopupLazy
						openCart={ openCart }
						setOpenCart={ setOpenCart }
						setShowCheckout={ setShowCheckout }
					/>
				</Suspense>
				<Suspense fallback={ null }>
					<CheckoutPopupLazy
						showCheckout={ showCheckout }
						setShowCheckout={ setShowCheckout }
					/>
				</Suspense>
			</CartWrapper>
		</AppWrapper>
	);
}
