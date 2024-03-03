import apiFetch from '@wordpress/api-fetch';
import { ApiResponseSuccess } from '../types';

export async function api(
	namespace: string,
	endpoint: string,
	data?: object | string,
	method = 'GET'
): Promise< any > {
	const isGet = 'GET' === method;
	const isDelete = 'DELETE' === method;
	const isPatch = 'PATCH' === method;
	if ( data ) {
		if ( isGet ) {
			// @ts-ignore
			endpoint += '?' + new URLSearchParams( data ).toString();
		} else if ( isDelete ) {
			endpoint += '/' + data + '?_method=DELETE';
		} else if ( isPatch ) {
			endpoint += '?_method=PATCH';
		}
	}

	const headers = {
		Authorization: undefined,
	};

	const auth = JSON.parse( window.localStorage.getItem( 'auth' ) );
	if ( auth && auth.authorizationCode ) {
		headers.Authorization = `Basic ${ auth.authorizationCode }`;
	}

	return await apiFetch( {
		data: isGet || isDelete ? undefined : data,
		namespace,
		endpoint,
		method,
		headers,
	} );
}

export async function apiNeon(
	endpoint: string,
	data?: object | string,
	method = 'GET'
): Promise< ApiResponseSuccess > {
	return await api( global.neon.namespace, endpoint, data, method );
}

export async function apiLivestream(
	endpoint: string,
	data?: object,
	method = 'GET'
): Promise< any > {
	return await api( global.livestream.namespace, endpoint, data, method );
}
