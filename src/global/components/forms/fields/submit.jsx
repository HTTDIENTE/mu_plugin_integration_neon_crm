import { Button, Form } from 'antd';
import '../../../styles/ant-form.scss';

export function Submit( { buttonTitle } ) {
	const form = Form.useFormInstance();

	return (
		<Form.Item shouldUpdate>
			{ () => (
				<Button
					type="primary"
					htmlType="submit"
					aria-disabled={
						! form.isFieldsTouched( true ) ||
						!! form
							.getFieldsError()
							.filter( ( { errors } ) => errors.length ).length
					}
				>
					{ buttonTitle ? buttonTitle : 'Submit' }
				</Button>
			) }
		</Form.Item>
	);
}
