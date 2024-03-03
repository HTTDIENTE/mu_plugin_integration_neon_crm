import { Form, Select } from 'antd';
import { countryOptions } from '../../../scripts/forms/properties';
import { FormItemFloatLabel } from './form-item-float-label';

export function Country( { index } ) {
	const form = Form.useFormInstance();

	return (
		<FormItemFloatLabel
			name={ [ index, 'country', 'id' ] }
			label="Country"
			rules={ [ { required: true } ] }
			/* Save autofill. We hang it on the wrapper, since the event does not occur in the selection itself. */
			onChange={ ( event ) => {
				if (
					countryOptions.filter(
						( a ) => a.label === event.target.value
					).length
				) {
					form.setFieldValue(
						[
							'primaryContact',
							'addresses',
							index,
							'country',
							'id',
						],
						event.target.value
					);
				}
			} }
		>
			<Select
				options={ countryOptions }
				showSearch={ true }
				optionFilterProp="label"
			/>
		</FormItemFloatLabel>
	);
}
