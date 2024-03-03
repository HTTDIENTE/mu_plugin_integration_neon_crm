import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function NameSuffix() {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'suffix' ] }
			label="Suffix"
		>
			<Input />
		</FormItemFloatLabel>
	);
}
