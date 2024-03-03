import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function AddressLine2( { index } ) {
	return (
		<FormItemFloatLabel
			name={ [ index, 'addressLine2' ] }
			label="AddressLine2"
		>
			<Input />
		</FormItemFloatLabel>
	);
}
