import { Select } from 'antd';
import { gendersOptions } from '../../../scripts/forms/properties';
import { FormItemFloatLabel } from './form-item-float-label';

export function Gender() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'gender', 'code' ] }
			label="Gender"
			rules={ [
				{
					required: true,
				},
			] }
		>
			<Select options={ gendersOptions } />
		</FormItemFloatLabel>
	);
}
