import { useState } from '@wordpress/element';
import { message } from 'antd';
import { apiNeon } from '../../../global/scripts/api';
import { setAccount, setAuth, setDate } from '../../../global/scripts/storage';
import { RegistrationForm } from '../../../global/components/forms/registration-form';
import Preloader from '../../../global/components/preloader';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';

export default function Registration( { app } ) {
	const [ messageApi, contextHolder ] = message.useMessage();
	const [ preloader, setPreloader ] = useState( false );

	const sendUserData = async ( formData ) => {
		setPreloader( true );

		try {
			const response = await apiNeon( 'account', formData, 'POST' );
			setAccount( response.data.account );
			setAuth( response.data.auth );
			setDate( 'account' );
			messageApi.open( { type: 'success', content: response.message } );
			setPreloader( false );
		} catch ( error ) {
			ShowErrors( error, messageApi );
			setPreloader( false );
		}
	};

	return (
		<>
			{ preloader && <Preloader /> }
			{ contextHolder }
			<div className="registration">
				<h2 className="registration__title">Registration Form</h2>
				<RegistrationForm onSubmit={ sendUserData } app={ app } messageApi={ messageApi } />
			</div>
		</>
	);
}
