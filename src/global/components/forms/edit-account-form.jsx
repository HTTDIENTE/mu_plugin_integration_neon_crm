import { AccountForm } from './account-form';

export function EditAccountForm( { onSubmit, messageApi } ) {
	return (
		<AccountForm
			multipleAddress={ true }
			formName={ 'edit-account-form' }
			onSubmit={ ( values ) => onSubmit( values, 'account' ) }
			messageApi={ messageApi }
		/>
	);
}
