import { Form } from 'antd';
import { validateMessages } from '../../scripts/forms/values-config';
import { useEffect, useState } from '@wordpress/element';
import { Addresses } from './fields/addresses';
import { Passwords } from './fields/passwords';
import { Birthday } from './fields/birthday';
import { Gender } from './fields/gender';
import { Salutation } from './fields/salutation';
import { NameSuffix } from './fields/name-suffix';
import { NamePrefix } from './fields/name-prefix';
import { LastName } from './fields/last-name';
import { MiddleName } from './fields/middle-name';
import { FirstName } from './fields/first-name';
import { Email } from './fields/email';
import { Login } from './fields/login';
import { Agreement } from './fields/agreement';
import { Submit } from './fields/submit';
import { useAccount } from '../../hooks/use-account';
import { ContactId } from './fields/contactId';
import { apiNeon } from '../../scripts/api';

export function AccountForm( { formName, onSubmit, multipleAddress, messageApi } ) {
	const [ form ] = Form.useForm();
	const [ account ] = useAccount();
	const [ isAvailable, setIsAvailable ] = useState( { email: true, username: true } );

	useEffect( () => {
		if ( form.isFieldsTouched( [ [ 'login', 'username' ], [ 'primaryContact', 'email1' ] ] ) ) {
			form.validateFields( [ [ 'login', 'username' ], [ 'primaryContact', 'email1' ] ] ).then();
		}
	}, [ isAvailable ] );

	const fieldCheckingRequest = async ( value, endpoint ) => {
		try {
			const response = await apiNeon(
				`account/check/${ endpoint }`,
				{ [ endpoint ]: value },
				'POST'
			);
			setIsAvailable( { ...isAvailable, [ endpoint ]: response.data.isAvailable } );
		} catch ( error ) {
			messageApi.open( { type: 'error', content: error.message, duration: 5 } );
		}
	};

	const checkField = ( name ) => {
		const value = form.getFieldValue( name );
		const hasOldValue = !! account?.[ name[ 0 ] ]?.[ name[ 1 ] ];
		const isNewValue = hasOldValue ? account[ name[ 0 ] ][ name[ 1 ] ] !== value : true;
		const isFieldValid = ! form.getFieldError( name ).filter( ( item ) => ! item.includes( 'taken' ) ).length;
		const endpoint = name[ 1 ].replace( /[0-9]/g, '' );

		if ( ! isFieldValid ) {
			setIsAvailable( { ...isAvailable, [ endpoint ]: ! isFieldValid } );
		}

		if ( isNewValue && isFieldValid ) {
			fieldCheckingRequest( value, endpoint ).then();
		}
	};

	return (
		<Form
			name={ formName }
			form={ form }
			initialValues={ account }
			onFinish={ ( values ) => onSubmit( values ) }
			validateMessages={ validateMessages }
			autoComplete="off"
			scrollToFirstError
		>
			<Login
				checkField={ checkField }
				isAvailable={ isAvailable.username }
				initialValueUsername={ account?.login?.username ? account?.login?.username : ' ' }
			/>
			<Email
				checkField={ checkField }
				isAvailable={ isAvailable.email }
				initialValueEmail={ account?.primaryContact?.email1 ? account?.primaryContact?.email1 : ' ' }
			/>
			<FirstName />
			<MiddleName />
			<LastName />
			<NamePrefix />
			<NameSuffix />
			<Salutation />
			<Gender />
			<Birthday />
			<ContactId />
			<Addresses max={ multipleAddress ? 10 : 1 } formName={ formName } />

			{ formName.endsWith( 'registration-form' ) && (
				<>
					<Passwords />
					<Agreement />
				</>
			) }

			<Submit />
		</Form>
	);
}
