import { Input } from 'antd';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useGetSelectedCountryCode } from '../../../hooks/use-get-selected-country-code';
import { useCaretNormalize } from '../../../hooks/use-caret-normalize';
import { FormItemFloatLabel } from './form-item-float-label';

function formatPhone( value, selectedCountryCode ) {
	if ( value ) {
		if ( selectedCountryCode ) {
			const phoneBySelected = parsePhoneNumberFromString(
				value,
				selectedCountryCode
			);
			if ( phoneBySelected && phoneBySelected.isValid() ) {
				return phoneBySelected.formatInternational();
			}
		}

		if ( ! value.toString().startsWith( '+' ) ) {
			return formatPhone( '+' + value, selectedCountryCode );
		}
	}

	return value;
}

function validatePhone( value ) {
	if ( value ) {
		const phone = parsePhoneNumberFromString( value );
		if ( ! phone || ! phone.isValid() ) {
			return Promise.reject( 'Phone Number is invalid!' );
		}
	}

	return Promise.resolve();
}

export function Phone( { index } ) {
	const selectedCountryCode = useGetSelectedCountryCode( index );
	const [ input, normalize ] = useCaretNormalize( [
		'primaryContact',
		'addresses',
		index,
		'phone1',
	] );

	return (
		<FormItemFloatLabel
			name={ [ index, 'phone1' ] }
			label="Phone Number"
			rules={ [
				{ required: true },
				{
					validator( _, value ) {
						return validatePhone( value );
					},
				},
			] }
			normalize={ ( value ) => {
				return normalize(
					value,
					formatPhone( value, selectedCountryCode )
				);
			} }
			getValueProps={ ( value ) => {
				return {
					value: formatPhone( value, selectedCountryCode ),
				};
			} }
		>
			<Input type={ 'tel' } ref={ input } />
		</FormItemFloatLabel>
	);
}
