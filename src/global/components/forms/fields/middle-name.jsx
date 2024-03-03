import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function MiddleName() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'middleName' ] }
			label="Middle Name"
		>
			<Input />
		</FormItemFloatLabel>
	);
}
