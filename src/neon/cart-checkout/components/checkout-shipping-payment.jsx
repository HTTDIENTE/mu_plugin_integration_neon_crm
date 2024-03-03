import { apiNeon } from '../../../global/scripts/api';
import { delCartItems, setDate, setOrders } from '../../../global/scripts/storage';
import moment from 'moment/moment';
import { useContext } from '@wordpress/element';
import { CartContext } from '../../../global/contexts/cart-context';
import { nameFormat } from '../../../global/scripts/data-format/name-format';
import { AddressCard } from '../../../global/components/forms/fields/address-card';
import { PaymentCard } from '../../../global/components/forms/fields/payment-card';
import { PaymentSubmitForm } from '../../../global/components/forms/fields/payment-submit-form';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';
import { SubmitForm } from './submit-form';

function formatDataForNeon(
	token,
	products,
	shippingAddress,
	shippingNames,
	shippingMethodName,
	shippingMethodFee,
	billingAddress
) {
	return {
		checkoutData: {
			products,
			orderDate: moment().utc().format(),
			needShipping: true,
			shippingHandlingFee: shippingMethodFee,
			shipping: {
				shippingMethodName,
				shippingDeliverTo: nameFormat( shippingNames ),
				zipCode: shippingAddress.zipCode,
				addressLine1: shippingAddress.addressLine1,
			},
			payments: [
				{
					tenderType: 4,
					receivedDate: moment().utc().format(),
					creditCardOnline: {
						token,
						billingAddress: {
							addressLine1: billingAddress.addressLine1,
							addressLine2: billingAddress.addressLine2,
							city: billingAddress.city,
							stateProvinceCode: billingAddress.stateProvince.code,
							countryId: billingAddress.country.id,
							zipCode: billingAddress.zipCode,
						},
					},
				},
			],
		},
	};
}

function formatDataForNeonWithoutPayment(
	products,
	shippingAddress,
	shippingNames,
	shippingMethodName,
	shippingMethodFee,
) {
	return {
		checkoutData: {
			products,
			orderDate: moment().utc().format(),
			needShipping: true,
			shippingHandlingFee: shippingMethodFee,
			shipping: {
				shippingMethodName,
				shippingDeliverTo: nameFormat( shippingNames ),
				zipCode: shippingAddress.zipCode,
				addressLine1: shippingAddress.addressLine1,
			},
		},
	};
}

export function CheckoutShippingPayment( { isCurrent } ) {
	const {
		messageApi,
		setPreloader,
		cartItems,
		cartTotal,
		setCartTotal,
		billingAddress,
		shippingAddress,
		shippingNames,
		shippingMethodName,
		shippingMethodFee,
		setShippingMethodName,
		form,
	} = useContext( CartContext );

	const needPayment = cartTotal ? Number( cartTotal.totalCharge ) > 0 : true;

	async function onSubmitSuccess( { token } ) {
		setPreloader( true );

		const products = cartItems.map( ( item ) => ( {
			productId: item.id,
			unitPrice: item.price,
			quantity: item.quantity,
		} ) );
		const data = needPayment
			? formatDataForNeon(
				token,
				products,
				shippingAddress,
				shippingNames,
				shippingMethodName,
				shippingMethodFee,
				billingAddress
			) : formatDataForNeonWithoutPayment( products,
				shippingAddress,
				shippingNames,
				shippingMethodName,
				shippingMethodFee
			);

		try {
			const response = await apiNeon( 'orders', data, 'POST' );
			setOrders( response.data.orders );
			setDate( 'orders' );
			delCartItems();
			setCartTotal( {} );
			setShippingMethodName( null );
			setPreloader( false );
			messageApi.open( { type: 'success', content: response.message } );
			// window.location = global.neon.pages.thankYouPage;
		} catch ( error ) {
			ShowErrors( error, messageApi );
			setPreloader( false );
		}
	}

	return (
		<div
			className={ [ 'checkout__payment', ! isCurrent && 'inactive' ].join(
				' '
			) }
		>
			{ isCurrent && needPayment && (
				<>
					<h2 className="checkout__title">Payment</h2>
					<PaymentCard id="checkout-card-field" form={ form } />
					<AddressCard
						className="checkout-billing-address-form"
						context={ CartContext }
						type="billing"
					/>
					<PaymentSubmitForm
						onSubmitSuccess={ onSubmitSuccess }
						formName={ 'checkout' }
						buttonTitle="Place Order"
						context={ CartContext }
					/>
				</>
			) }
			{ isCurrent && ! needPayment && (
				<SubmitForm
					onSubmitSuccess={ onSubmitSuccess }
					formName={ 'checkout' }
					buttonTitle="Place Order"
					context={ CartContext }
				/>
			) }
		</div>
	);
}
