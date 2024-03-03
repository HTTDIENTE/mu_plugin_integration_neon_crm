import { Input } from 'antd';
import { validate } from 'postal-codes-js';
import { useGetSelectedCountryCode } from '../../../hooks/use-get-selected-country-code';
import { useCaretNormalize } from '../../../hooks/use-caret-normalize';
import { FormItemFloatLabel } from './form-item-float-label';

function formatZipCode( value, selectedCountryCode ) {
	if ( value && 'US' === selectedCountryCode ) {
		const result = validate( selectedCountryCode, value );
		if ( true === result && value.replace( /\s/g, '' ).length === 9 ) {
			value = value.replace( /^([0-9]{5})(\D)*([0-9]{4})?$/, '$1-$3' );
		}
	}

	return value;
}

function validateZipCode( value, selectedCountryCode ) {
	if ( value ) {
		const result =
			'US' === selectedCountryCode
				? validate( selectedCountryCode, value )
				: true;
		if ( true !== result ) {
			return Promise.reject( result );
		}
	}

	return Promise.resolve();
}

export function ZipCode( { index } ) {
	const selectedCountryCode = useGetSelectedCountryCode( index );
	const [ input, normalize ] = useCaretNormalize( [
		'primaryContact',
		'addresses',
		index,
		'zipCode',
	] );

	return (
		<FormItemFloatLabel
			name={ [ index, 'zipCode' ] }
			label="Zip Code"
			rules={ [
				{ required: 'US' === selectedCountryCode },
				{
					validator( _, value ) {
						return validateZipCode( value, selectedCountryCode );
					},
				},
			] }
			normalize={ ( value ) => {
				return normalize(
					value,
					formatZipCode( value, selectedCountryCode )
				);
			} }
			getValueProps={ ( value ) => {
				return {
					value: formatZipCode( value, selectedCountryCode ),
				};
			} }
		>
			<Input ref={ input } />
		</FormItemFloatLabel>
	);
}
