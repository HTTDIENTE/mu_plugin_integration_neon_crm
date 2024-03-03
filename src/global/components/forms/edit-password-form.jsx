import { Form, Input } from 'antd';
import { validateMessages } from '../../scripts/forms/values-config';
import { Passwords } from './fields/passwords';
import { Submit } from './fields/submit';
import { useAccount } from '../../hooks/use-account';

export function EditPasswordForm( props ) {
	const [ form ] = Form.useForm();
	const [ account ] = useAccount();

	return (
		<Form
			name="password-form"
			form={ form }
			onFinish={ ( values ) =>
				props.onSubmit(
					{
						...values.login,
						username: account?.login?.username,
						contactId: account?.primaryContact?.contactId,
						firstName: account?.primaryContact?.firstName,
						lastName: account?.primaryContact?.lastName,
					},
					'account/password'
				)
			}
			validateMessages={ validateMessages }
			autoComplete="off"
			scrollToFirstError
		>
			<Input
				name="username"
				autoComplete="username"
				value={ account?.login?.username }
				style={ { display: 'none' } }
				readOnly={ true }
			/>
			<Passwords />
			<Submit />
		</Form>
	);
}
