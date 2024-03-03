import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function City( { index } ) {
	return (
		<FormItemFloatLabel
			name={ [ index, 'city' ] }
			label="City"
			rules={ [ { required: true } ] }
		>
			<Input />
		</FormItemFloatLabel>
	);
}
