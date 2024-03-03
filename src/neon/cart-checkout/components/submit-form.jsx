import { useContext } from '@wordpress/element';
import { Button, Form } from 'antd';

export function SubmitForm( {
	onSubmitSuccess,
	buttonTitle,
	context,
} ) {
	const { form } = useContext( context );

	return (
		<Form
			form={ form }
			onFinish={ onSubmitSuccess }
		>
			<Form.Item shouldUpdate>
				<Button
					type="primary"
					htmlType="submit"
				>
					{ buttonTitle ? buttonTitle : 'Submit' }
				</Button>
			</Form.Item>
		</Form>
	);
}
