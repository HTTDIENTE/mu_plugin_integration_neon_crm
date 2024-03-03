import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function AddressLine1( { index } ) {
	return (
		<FormItemFloatLabel
			name={ [ index, 'addressLine1' ] }
			label="AddressLine1"
			rules={ [ { required: true } ] }
		>
			<Input />
		</FormItemFloatLabel>
	);
}
