import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function Salutation() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'salutation' ] }
			label="Salutation"
		>
			<Input />
		</FormItemFloatLabel>
	);
}
