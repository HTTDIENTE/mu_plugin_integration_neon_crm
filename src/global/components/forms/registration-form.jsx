import { AccountForm } from './account-form';

export function RegistrationForm( props ) {
	const formName = props.app
		? `${ props.app }-registration-form`
		: 'registration-form';

	return (
		<AccountForm
			{ ...props }
			miltipleAddress={ false }
			formName={ formName }
			onSubmit={ ( values ) => props.onSubmit( values, 'account' ) }
			messageApi={ props.messageApi }
		/>
	);
}
