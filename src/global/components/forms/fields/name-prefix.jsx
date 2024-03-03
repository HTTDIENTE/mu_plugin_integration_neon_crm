import { Select } from 'antd';
import { namePrefixOptions } from '../../../scripts/forms/properties';
import { FormItemFloatLabel } from './form-item-float-label';

export function NamePrefix() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'prefix' ] }
			label="Prefix"
		>
			<Select options={ namePrefixOptions } />
		</FormItemFloatLabel>
	);
}
