import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function FirstName() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'firstName' ] }
			label="First Name"
			rules={ [ { required: true } ] }
		>
			<Input />
		</FormItemFloatLabel>
	);
}
