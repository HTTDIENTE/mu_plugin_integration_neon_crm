import { Form, message } from 'antd';
import { CartContext } from '../../../global/contexts/cart-context';
import { useAccount } from '../../../global/hooks/use-account';
import { useCartItems } from '../../../global/hooks/use-cart-items';
import { useEffect, useState } from '@wordpress/element';
import Preloader from '../../../global/components/preloader';

export function CartWrapper( { children } ) {
	const [ form ] = Form.useForm();
	const [ account ] = useAccount();
	const [ cartItems ] = useCartItems();
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ preloader, setPreloader ] = useState( false );
	const [ cardComplete, setCardComplete ] = useState( false );
	const subTotal = cartItems
		.map( ( item ) => item.price * item.quantity )
		.reduce( ( previous, current ) => previous + current, 0 );

	const [ cartTotal, setCartTotal ] = useState( 0 );

	const names = {
		firstName: account?.primaryContact?.firstName || '',
		middleName: account?.primaryContact?.middleName || '',
		lastName: account?.primaryContact?.lastName || '',
	};
	const primaryAddress =
		account?.primaryContact?.addresses?.filter(
			( item ) => item.isPrimaryAddress
		)[ 0 ] || {};

	const [ shippingMethodName, setShippingMethodName ] = useState( null );
	const [ shippingMethodFee, setShippingMethodFee ] = useState( null );
	const [ shippingAddress, setShippingAddress ] = useState( primaryAddress );
	const [ shippingNames, setShippingNames ] = useState( names );
	const [ billingAddress, setBillingAddress ] = useState( primaryAddress );
	const [ billingNames, setBillingNames ] = useState( names );
	const [ isComplete, setIsComplete ] = useState( false );
	const [ openShippingAddressForm, setIsOpenShippingAddressForm ] =
		useState( false );
	const [ openBillingAddressForm, setIsOpenBillingAddressForm ] =
		useState( false );

	useEffect( () => {
		setIsComplete(
			!! (
				shippingMethodName &&
				shippingNames?.firstName &&
				shippingNames?.lastName &&
				shippingAddress?.addressLine1 &&
				shippingAddress?.city &&
				shippingAddress?.stateProvince?.code &&
				shippingAddress?.country?.id &&
				shippingAddress?.zipCode &&
				shippingAddress?.phone1 &&
				cardComplete &&
				! openShippingAddressForm &&
				! openBillingAddressForm
			)
		);
	}, [
		shippingMethodName,
		shippingAddress,
		shippingNames,
		cardComplete,
		openShippingAddressForm,
		openBillingAddressForm,
	] );

	return (
		<CartContext.Provider
			value={ {
				cartItems,
				subTotal,
				cartTotal,
				setCartTotal,

				shippingMethodName,
				setShippingMethodName,
				shippingMethodFee,
				setShippingMethodFee,
				shippingAddress,
				setShippingAddress,
				shippingNames,
				setShippingNames,
				billingAddress,
				setBillingAddress,
				billingNames,
				setBillingNames,

				form,
				messageApi,
				setPreloader,
				cardComplete,
				setCardComplete,
				isComplete,
				setIsComplete,
				openShippingAddressForm,
				setIsOpenShippingAddressForm,
				openBillingAddressForm,
				setIsOpenBillingAddressForm,
			} }
		>
			{ preloader && <Preloader /> }
			{ contextHolder }
			{ children }
		</CartContext.Provider>
	);
}
