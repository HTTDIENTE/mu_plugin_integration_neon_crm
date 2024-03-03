import { Form, Select } from 'antd';
import { stateProvincesOptions } from '../../../scripts/forms/properties';
import { useGetSelectedCountryCode } from '../../../hooks/use-get-selected-country-code';
import { useRef } from '@wordpress/element';
import { FormItemFloatLabel } from './form-item-float-label';

export function StateProvince( { index } ) {
	const form = Form.useFormInstance();
	const selectedCountryCode = useGetSelectedCountryCode( index );
	const selectRef = useRef( null );

	return (
		<FormItemFloatLabel
			name={ [ index, 'stateProvince', 'code' ] }
			label="State Province"
			rules={ [ { required: 'US' === selectedCountryCode } ] }
			/* Save autofill. We hang it on the wrapper, since the event does not occur in the selection itself. */
			onChange={ ( event ) => {
				if (
					stateProvincesOptions.filter(
						( a ) => a.label === event.target.value
					).length
				) {
					form.setFieldValue(
						[
							'primaryContact',
							'addresses',
							index,
							'stateProvince',
							'code',
						],
						event.target.value
					);
				}
			} }
		>
			<Select
				ref={ selectRef }
				options={ stateProvincesOptions }
				showSearch={ true }
				optionFilterProp="label"
			/>
		</FormItemFloatLabel>
	);
}
