import { Form } from 'antd';

function getCountryCodeByNeonId( countryNeonId ) {
	if ( '1' === countryNeonId ) {
		return 'US';
	}

	return '';
}

export function useGetSelectedCountryCode( index ) {
	const form = Form.useFormInstance();
	const countryNeonId = Form.useWatch(
		[ 'primaryContact', 'addresses', index, 'country', 'id' ],
		form
	);

	return getCountryCodeByNeonId( countryNeonId );
}
