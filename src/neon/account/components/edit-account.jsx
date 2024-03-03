import { useState } from '@wordpress/element';
import { message } from 'antd';
import { apiNeon } from '../../../global/scripts/api';
import { setAccount, setDate } from '../../../global/scripts/storage';
import { EditAccountForm } from '../../../global/components/forms/edit-account-form';
import { EditPasswordForm } from '../../../global/components/forms/edit-password-form';
import Preloader from '../../../global/components/preloader';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';

export default function EditAccount() {
	const [ preloader, setPreloader ] = useState( false );
	const [ messageApi, contextHolder ] = message.useMessage();

	const sendUserData = async ( formData, endpoint ) => {
		setPreloader( true );

		try {
			const response = await apiNeon( endpoint, formData, 'PATCH' );
			if ( 'account' === endpoint ) {
				setAccount( response.data.account );
				setDate( endpoint );
			}
			messageApi.open( {
				type: 'success',
				content: response.message,
				duration: 5,
			} );
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
			<div className="edit-account">
				<h2 className="edit-account__title">Edit Account</h2>
				<EditAccountForm
					onSubmit={ sendUserData }
					messageApi={ messageApi }
				/>
				<EditPasswordForm onSubmit={ sendUserData } />
			</div>
		</>
	);
}
