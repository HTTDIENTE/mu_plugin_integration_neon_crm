import { Checkbox, Form } from 'antd';

export function Agreement() {
	return (
		<Form.Item
			name="agreement"
			valuePropName="checked"
			rules={ [
				{
					validator: ( _, value ) =>
						value
							? Promise.resolve()
							: Promise.reject(
									new Error( 'Should accept agreement' )
							  ),
				},
			] }
		>
			<Checkbox>Agree</Checkbox>
		</Form.Item>
	);
}
