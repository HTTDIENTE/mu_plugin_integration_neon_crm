import { Form, Input } from 'antd';

export function ContactId() {
	return (
		<Form.Item
			name={ [ 'primaryContact', 'contactId' ] }
			style={ { display: 'none' } }
		>
			<Input />
		</Form.Item>
	);
}
