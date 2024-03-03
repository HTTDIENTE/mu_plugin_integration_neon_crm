import '../styles/checkout.scss';
import { lazy, Suspense } from '@wordpress/element';
import { CheckoutCartItems } from './checkout-cart-items';
import { CheckoutShippingDetails } from './checkout-shipping-details';
import { useIsLoggedIn } from '../../../global/hooks/use-is-logged-in';

export function Checkout() {
	const [ isLoggedIn ] = useIsLoggedIn();

	const RegistrationLazy = lazy( () =>
		import(
			/* webpackChunkName: "registration-form" */ '../../account/components/registration'
		)
	);

	return (
		<>
			{ isLoggedIn && (
				<div className="checkout__wrapper">
					<CheckoutShippingDetails />
					<CheckoutCartItems />
				</div>
			) }
			{ ! isLoggedIn && (
				<Suspense fallback={ <div>Loading...</div> }>
					<RegistrationLazy app={ 'checkout' } />
				</Suspense>
			) }
		</>
	);
}
