import type { FormInstance } from 'antd/es/form/hooks/useForm';
import type { MessageInstance } from 'antd/es/message/interface';

declare global {
	// noinspection JSUnusedGlobalSymbols
	interface Window {
		neon: Neon;
		livestream: Livestream;
		ga: ( command: string, hitType: string ) => {};
		NeonPay: NeonPay;
	}
}

interface NeonPay {
	new ( apiKeyPay: string, merchantId: string );

	createField( type, options ): NeonField;

	createToken( card, tokenData: object ): Promise< { token: string } >;

	fields: NeonField[];
}

interface NeonField {
	mount: ( selector ) => {};
	unmountField: ( selector ) => {};
	on: ( eventName: string, callback: NeonCallback ) => {};
}

interface NeonEvent {
	field: string;
	complete: boolean;
	empty: boolean;
}

interface NeonEventError {
	error: {
		code: string;
		message: string;
		type: string;
	};
}

type NeonCallback = ( event: NeonEvent | NeonEventError ) => void;

export interface AuthData {
	authorizationCode: string;
}

export interface AuthDataWithWithIsLoggedIn extends AuthData {
	isLoggedIn: boolean;
}

interface Address {
	addressId: string;
	isPrimaryAddress: true;
	addressLine1: string;
	addressLine2: string;
	city: string;
	stateProvince: {
		code: string;
	};
	country: {
		id: string;
	};
	zipCode: string;
	phone1: string;
}

interface PrimaryContact {
	addresses: Address[];
	firstName: string;
	middleName: string;
	lastName: string;
	prefix: string;
	suffix: string;
	salutation: string;
	dob: {
		day: string;
		month: string;
		year: string;
	};
	gender: {
		code: string;
	};
	email1: string;
	contactId: string;
}

export interface AccountData {
	primaryContact: PrimaryContact;
	login: {
		username: string;
	};
}

interface Item {
	id: string;
	name: string;
	type: string;
	unitPrice: number;
	quantity: number;
	price: number;
}

export interface OrderData {
	id: string;
	items: Item[];
	orderDate: string;
	totalCharge: number;
	subTotal: number;
	tax: number;
	totalDiscount: number;
	shippingHandlingFee: number;
	status: string;
	timestamps: {
		createdDateTime: string;
	};
}

export interface Product {
	id: number;
	categoryId: number;
	categoryTitle: string;
	title: string;
	code: string;
	description: string;
	price: number;
	quantity: number;
	images: [
		{
			url: string;
			alt: string;
		}
	];
}

export interface CartItem {
	id: number;
	categoryId: number;
	categoryTitle: string;
	title: string;
	code: string;
	description: string;
	price: number;
	quantity: number;
	images: [
		{
			url: string;
			alt: string;
		}
	];
}

export interface RecurringDonation {
	id: string;
	amount: number;
	frequency: string;
	nextDate: string;
}

export interface LastUpdateDates {
	account: string;
	orders: string;
	products: string;
	events: string;
	livestream: string;
}

export interface ShippingMethod {
	id: 'string';
	name: 'string';
	fee: 0;
}

export interface Event {
	id: number;
	neonEventId: number;
	title: string;
	summary: string;
	description: string;
	categoryId: number;
	categoryTitle: string;
	startDatetimeGMT: string;
	endDatetimeGMT: string;
	registrationOpenDatetimeGMT: string;
	registrationCloseDatetimeGMT: string;
	fees: number;
	needDonation: boolean;
	needPayment: boolean;
	needRegister: boolean;
}

export interface LiveStream {
	id: number;
	eventId: number;
	title: string;
	thumbnailUrl: string;
	url: string;
	publishDatetimeGMT: string;
}

export interface ApiResponse {
	code: string;
	message: string;
	data: {
		[ key: string ]: any;
	};
}

export interface ApiResponseSuccess extends ApiResponse {
	data: {
		auth: AuthData;
		account: AccountData;
		orders: OrderData[];
		dates: LastUpdateDates;
		recurringDonations: RecurringDonation[];
		products: Product[];
		cart: CartItem[];
		shippingMethods: ShippingMethod[];
		events: Event[];
		livestream: LiveStream[];
	};
}

export interface CaretPosition {
	start: number;
	end: number;
}

interface CartTotal {
	shippingHandlingFee: number;
	tax: number;
	totalCharge: number;
}

interface Names {
	firstName: string;
	middleName: string;
	lastName: string;
}

export interface CartContext {
	// Cart Data
	cartItems: Array< CartItem >;
	subTotal: number;
	cartTotal: CartTotal;
	setCartTotal( cartTotal: CartTotal ): void;

	// Order Data
	shippingMethodName: string;
	setShippingMethodName( shippingMethodName: string ): void;
	shippingMethodFee: number;
	setShippingMethodFee( shippingMethodFee: string ): void;
	shippingAddress: Address;
	setShippingAddress( address: Address ): void;
	shippingNames: Names;
	setShippingNames( shippingNames: Names ): void;
	billingAddress: Address;
	setBillingAddress( billingAddress: Address ): void;
	billingNames: Names;
	setBillingNames( billingNames: Names ): void;

	// Helpers
	form: FormInstance;
	messageApi: MessageInstance;
	setPreloader( preloader: boolean ): boolean;
	cardComplete: boolean;
	setCardComplete( cardComplete: boolean ): boolean;
	openShippingAddressForm: boolean;
	setIsOpenShippingAddressForm( openShippingAddressForm: boolean ): boolean;
	openBillingAddressForm: boolean;
	setIsOpenBillingAddressForm( openBillingAddressForm: boolean ): boolean;
}

export declare type Neon = {
	readonly namespace: string;
	readonly organizationId: string;
	readonly clientId: string;
	readonly merchantId: string;
	readonly payApiKey: string;
	readonly payJsUrl: string;
	readonly subscriptionNewsLatterId: string;
	readonly subscriptionBlogId: string;
	readonly pages: {
		readonly onlineStore: string;
		readonly events: string;
		readonly donations: string;
		readonly thankYouPage: string;
		readonly oneTimeDonationThankYouPage: string;
		readonly recurringDonationThankYouPage: string;
	};
};

export declare type Livestream = {
	readonly namespace: string;
	readonly pages: {
		readonly livestream: string;
	};
};
