import { createContext } from '@wordpress/element';
import type { CartContext as CartContextType } from '../types';
import type * as React from 'react';

function create(): React.Context< CartContextType > {
	return createContext( {
		// Cart Data
		cartItems: [],
		subTotal: 0,
		cartTotal: null,
		setCartTotal: null,

		// Order Data
		shippingMethodName: '',
		setShippingMethodName: null,
		shippingMethodFee: 0,
		setShippingMethodFee: null,
		shippingAddress: null,
		setShippingAddress: null,
		shippingNames: null,
		setShippingNames: null,
		billingAddress: null,
		setBillingAddress: null,
		billingNames: null,
		setBillingNames: null,

		// Helpers
		form: null,
		messageApi: null,
		setPreloader: null,
		cardComplete: false,
		setCardComplete: null,
		isComplete: false,
		setIsComplete: null,
		openShippingAddressForm: false,
		setIsOpenShippingAddressForm: null,
		openBillingAddressForm: false,
		setIsOpenBillingAddressForm: null,
	} );
}

export const CartContext = create();
