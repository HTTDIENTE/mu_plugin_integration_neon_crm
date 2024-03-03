import { Radio } from 'antd';
import { CartContext } from '../../../global/contexts/cart-context';
import { useShippingMethods } from '../../../global/hooks/use-shipping-methods';
import { apiNeon } from '../../../global/scripts/api';
import { useContext, useEffect } from '@wordpress/element';
import { setShippingMethods } from '../../../global/scripts/storage';
import { isMissingDataV2 } from '../../../global/scripts/data-format/is-missing-data-v2';
import { nameFormat } from '../../../global/scripts/data-format/name-format';
import moment from 'moment/moment';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';

function formatDataProducts( cartItems ) {
	return cartItems.map( ( item ) => ( {
		productId: item.id,
		unitPrice: item.price,
		quantity: item.quantity,
	} ) );
}

function formatDataForCalculate(
	cartItems,
	shippingAddress,
	shippingNames,
	shippingMethodName,
	shippingMethodFee
) {
	return {
		orderDate: moment().utc().format( 'YYYY-MM-DD' ),
		products: formatDataProducts( cartItems ),
		needShipping: true,
		shippingHandlingFee: shippingMethodFee,
		shipping: {
			shippingMethodName,
			shippingDeliverTo: nameFormat( shippingNames ),
			city: shippingAddress.city,
			stateProvince: shippingAddress.stateProvince,
			country: shippingAddress.country,
			zipCode: shippingAddress.zipCode,
			addressLine1: shippingAddress.addressLine1,
			addressLine2: shippingAddress.addressLine2,
			phone: shippingAddress.phone1.replace( / +/g, '' ),
		},
	};
}

function formatDataForGetShippingMethods( cartItems, shippingAddress ) {
	return {
		countryId: shippingAddress.country.id,
		zipCode: shippingAddress.zipCode,
		products: formatDataProducts( cartItems ),
	};
}

export function CheckoutShippingOptions( { isCurrent, setCurrentStep } ) {
	const [ shippingMethods ] = useShippingMethods();
	const {
		cartItems,
		setCartTotal,
		shippingNames,
		shippingMethodName,
		setShippingMethodName,
		shippingMethodFee,
		setShippingMethodFee,
		shippingAddress,
		messageApi,
		setPreloader,
	} = useContext( CartContext );

	useEffect( () => {
		if ( shippingMethodName ) {
			requestCalculateAmount().then();
		}
	}, [ shippingAddress, cartItems, shippingMethodName ] );

	const requestCalculateAmount = async () => {
		setPreloader( true );

		const data = formatDataForCalculate(
			cartItems,
			shippingAddress,
			shippingNames,
			shippingMethodName,
			shippingMethodFee
		);

		try {
			const response = await apiNeon( 'orders/calculate', data, 'POST' );
			setCurrentStep( { ...isCurrent, payment: true } );
			// noinspection JSUnresolvedVariable
			setCartTotal( response.data.orderCalculationResult );
		} catch ( error ) {
			ShowErrors( error, messageApi );
		}

		setPreloader( false );
	};

	const onChange = async ( event ) => {
		setShippingMethodName( event.target.method );
		setShippingMethodFee( event.target.value );
	};

	useEffect( () => {
		if ( ! isMissingDataV2( shippingNames, shippingAddress ) ) {
			requestShippingMethods().then();
		}
	}, [] );

	const requestShippingMethods = async () => {
		const data = formatDataForGetShippingMethods(
			cartItems,
			shippingAddress
		);

		try {
			const response = await apiNeon(
				'orders/shipping-methods',
				data,
				'POST'
			);
			setShippingMethods( response.data.shippingMethods );
			setCurrentStep( { ...isCurrent, options: true } );
		} catch ( error ) {
			messageApi.open( { type: 'error', content: error.message } );
		}
	};

	return (
		<div
			className={ [
				'checkout__shipping-options',
				! isCurrent.options && 'inactive',
			].join( ' ' ) }
		>
			<h2 className="checkout__title">Shipping Options</h2>
			{ isCurrent.options && (
				<Radio.Group onChange={ onChange }>
					{ shippingMethods.map( ( method, index ) => (
						<Radio
							key={ index }
							value={ method.fee }
							method={ method.name }
						>
							{ method.name }
						</Radio>
					) ) }
				</Radio.Group>
			) }
		</div>
	);
}
