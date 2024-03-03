import { Form, Input } from 'antd';

export function AddressId( { index } ) {
	return (
		<Form.Item
			name={ [ index, 'addressId' ] }
			style={ { display: 'none' } }
		>
			<Input type={ 'hidden' } />
		</Form.Item>
	);
}
