import { Groups } from '../constants';
import {
	AccountData,
	AuthData,
	AuthDataWithWithIsLoggedIn,
	CartItem,
	LastUpdateDates,
	OrderData,
	Product,
	RecurringDonation,
	ShippingMethod,
	Event,
	LiveStream,
} from '../types';

function set( key: string, value: any ) {
	const oldValue = window.localStorage.getItem( key );
	const newValue = JSON.stringify( value );

	if ( oldValue !== newValue ) {
		window.localStorage.setItem( key, newValue );
		window.dispatchEvent(
			new StorageEvent( 'storage', {
				key,
				oldValue,
				newValue,
				storageArea: window.localStorage,
				url: window.location.href,
			} )
		);
	}
}

function get( key: string, defaultValue = {} ) {
	return JSON.parse( window.localStorage.getItem( key ) ) || defaultValue;
}

function del( key: string ) {
	const oldValue = window.localStorage.getItem( key );

	window.localStorage.removeItem( key );
	window.dispatchEvent(
		new StorageEvent( 'storage', {
			key,
			oldValue,
			newValue: null,
			storageArea: window.localStorage,
			url: window.location.href,
		} )
	);
}

export function getAuth(): AuthDataWithWithIsLoggedIn {
	const authData = get( Groups.AUTH );

	return {
		...authData,
		isLoggedIn: !! authData.authorizationCode,
	};
}

export function setAuth( authData: AuthData ) {
	set( Groups.AUTH, authData );
}

export function delAuth() {
	del( Groups.AUTH );
}

export function getAccount(): AccountData {
	return get( Groups.ACCOUNT );
}

export function setAccount( accountData: AccountData ) {
	set( Groups.ACCOUNT, accountData );
}

export function delAccount() {
	del( Groups.ACCOUNT );
}

export function getOrders(): OrderData[] {
	return get( Groups.ORDERS, [] );
}

export function setOrders( orderData: OrderData[] ) {
	set( Groups.ORDERS, orderData );
}

export function delOrders() {
	del( Groups.ORDERS );
}

export function getRecurringDonations(): RecurringDonation[] {
	return get( Groups.RECURRING_DONATIONS, [] );
}

export function setRecurringDonations(
	recurringDonation: RecurringDonation[]
) {
	set( Groups.RECURRING_DONATIONS, recurringDonation );
}

export function delRecurringDonations() {
	del( Groups.RECURRING_DONATIONS );
}

export function getProduct( productId ): Product {
	const product = getProducts().find(
		( p ) => p.id === parseInt( productId, 10 )
	);

	if ( ! product ) {
		throw new Error( 'Product not found' );
	}

	return product;
}

export function getProducts(): Product[] {
	return get( Groups.PRODUCTS, [] );
}

export function setProducts( productData: Product ) {
	set( Groups.PRODUCTS, productData );
}

export function delProducts() {
	del( Groups.PRODUCTS );
}

export function getCartItems(): CartItem[] {
	return get( Groups.CART, [] );
}

export function setCartItems( cartItems: CartItem[] ) {
	set( Groups.CART, cartItems );
}

export function setCartItem( cartItemData: CartItem ) {
	const items = getCartItems();
	items.push( cartItemData );
	setCartItems( items );
}

export function delCartItems() {
	del( Groups.CART );
}

export function delCartItem( cartItemId ) {
	setCartItems(
		getCartItems().filter( ( item ) => {
			return item.id !== cartItemId;
		} )
	);
}

export function setDates( dates: LastUpdateDates ) {
	set( Groups.DATES, dates );
}

export function getDates(): LastUpdateDates {
	return get( Groups.DATES );
}

export function setDate( endpoint ) {
	const dates = getDates();
	dates[ endpoint ] = new Date().toISOString();
	set( Groups.DATES, dates );
}

export function setShippingMethods( methods: ShippingMethod[] ) {
	set( Groups.SHIPPING_METHODS, methods );
}

export function getShippingMethods(): ShippingMethod[] {
	return get( Groups.SHIPPING_METHODS, [] );
}

export function delShippingMethods() {
	del( Groups.SHIPPING_METHODS );
}

export function getEvents(): Event[] {
	return get( Groups.EVENTS, [] );
}

export function setEvents( eventsData: Event ) {
	set( Groups.EVENTS, eventsData );
}

export function delEvents() {
	del( Groups.EVENTS );
}

export function getEvent( eventId ): Event {
	const event = getEvents().find( ( e ) => e.id === parseInt( eventId, 10 ) );

	if ( ! event ) {
		throw new Error( 'Event not found' );
	}

	return event;
}

export function getLiveStreams(): LiveStream[] {
	return get( Groups.LIVESTREAMS, [] );
}

export function setLiveStreams( liveStreamsData: LiveStream ) {
	set( Groups.LIVESTREAMS, liveStreamsData );
}

export function delLiveStreams() {
	del( Groups.LIVESTREAMS );
}
