import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function LastName() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'lastName' ] }
			label="Last Name"
			rules={ [ { required: true } ] }
		>
			<Input />
		</FormItemFloatLabel>
	);
}
