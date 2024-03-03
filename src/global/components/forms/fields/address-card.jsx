import { FirstName } from './first-name';
import { MiddleName } from './middle-name';
import { LastName } from './last-name';
import DropdownSelectAddress from '../../dropdown-select-address';
import { Addresses } from './addresses';
import { Checkbox, Form } from 'antd';
import { Submit } from './submit';
import { useContext, useEffect, useState } from '@wordpress/element';
import { SavedUserInformation } from '../../saved-user-information';
import { useAccount } from '../../../hooks/use-account';
import { apiNeon } from '../../../scripts/api';
import { setAccount, setDate } from '../../../scripts/storage';
import { validateMessages } from '../../../scripts/forms/values-config';
import { isMissingDataV2 } from '../../../scripts/data-format/is-missing-data-v2';
import { ShowErrors } from '../../../scripts/actions/show-errors';

export function AddressCard( { type, context } ) {
	const {
		messageApi,
		setPreloader,
		shippingAddress,
		setShippingAddress,
		shippingNames,
		setShippingNames,
		billingNames,
		setBillingNames,
		billingAddress,
		setBillingAddress,
		setIsOpenShippingAddressForm,
		setIsOpenBillingAddressForm,
	} = useContext( context );

	const names = 'billing' === type ? billingNames : shippingNames;
	const address = 'billing' === type ? billingAddress : shippingAddress;

	const data = {
		primaryContact: {
			...names,
			addresses: [ address ],
		},
	};

	const [ form ] = Form.useForm();
	const [ account ] = useAccount();
	const [ isNewAddress, setIsNewAddress ] = useState( false );
	const [ isNeedSaveNewAddress, setIsNeedSaveNewAddress ] = useState( false );
	const [ isNeedSaveAddress, setIsNeedSaveAddress ] = useState( false );
	const [ isEdit, setIsEdit ] = useState( isMissingDataV2( names, address ) );
	const [ currentAddressIndex, setCurrentAddressIndex ] = useState( 0 );
	const [ addressHasBeenChanged, setAddressHasBeenChanged ] =
		useState( false );

	const handlerAddressClick = ( index ) => {
		let newCurrentAddress;
		if ( index !== -1 ) {
			newCurrentAddress = {
				...account.primaryContact.addresses[ index ],
			};
			setIsNewAddress( false );
		} else {
			newCurrentAddress = {
				...data.primaryContact.addresses[ 0 ],
			};
			for ( const key of Object.keys( newCurrentAddress ) ) {
				newCurrentAddress[ key ] = '';
			}
			setIsNewAddress( true );
		}

		form.setFieldsValue( newCurrentAddress );

		setCurrentAddressIndex( index );
		setAddressHasBeenChanged( false );
	};

	const postAddresses = async () => {
		try {
			const response = await apiNeon( 'account', account, 'PATCH' );
			setAccount( response.data.account );
			setDate( 'account' );
			messageApi.open( {
				type: 'success',
				content: 'Addresses updated',
			} );
		} catch ( error ) {
			ShowErrors( error, messageApi );
		}
	};

	const postNewAddress = ( newAddress ) => {
		account.primaryContact.addresses.push( {
			...newAddress,
			isPrimaryAddress: false,
		} );

		postAddresses().then();
	};

	const postUpdateAddress = ( addressIndex, updatedAddress ) => {
		account.primaryContact.addresses[ addressIndex ] = updatedAddress;

		postAddresses().then();
	};

	const onSubmit = ( values ) => {
		if ( isNeedSaveNewAddress || isNeedSaveAddress ) {
			setPreloader( true );

			const newAddress = values.primaryContact.addresses[ 0 ];
			const newNames = {
				firstName: values.primaryContact.firstName,
				middleName: values.primaryContact.middleName,
				lastName: values.primaryContact.lastName,
			};

			if ( isNeedSaveNewAddress ) {
				postNewAddress( newAddress );
			} else if ( isNeedSaveAddress ) {
				postUpdateAddress( currentAddressIndex, newAddress );
			}

			if ( 'billing' === type ) {
				setBillingAddress( newAddress );
				setBillingNames( newNames );
			} else {
				setShippingAddress( newAddress );
				setShippingNames( newNames );
			}

			setPreloader( false );
		}

		setIsEdit( false );
	};

	useEffect( () => {
		if ( 'billing' === type ) {
			setIsOpenBillingAddressForm( isEdit );
		} else {
			setIsOpenShippingAddressForm( isEdit );
		}
	}, [ isEdit ] );

	return (
		<>
			{ ! isEdit && (
				<SavedUserInformation
					userData={ data }
					setIsEdit={ setIsEdit }
				/>
			) }
			{ isEdit && (
				<Form
					form={ form }
					onFinish={ onSubmit }
					initialValues={ data }
					validateMessages={ validateMessages }
					scrollToFirstError
					onChange={ () => {
						let dataHasBeenChanged = false;
						if ( currentAddressIndex !== -1 ) {
							const newCurrentAddress =
								form.getFieldsValue().primaryContact
									.addresses[ 0 ];

							for ( const key in newCurrentAddress ) {
								if (
									account.primaryContact.addresses[
										currentAddressIndex
									][ key ] !== newCurrentAddress[ key ]
								) {
									dataHasBeenChanged = true;
									break;
								}
							}
						}

						setAddressHasBeenChanged( dataHasBeenChanged );
					} }
				>
					<FirstName />
					<MiddleName />
					<LastName />
					<DropdownSelectAddress
						handlerAddressClick={ handlerAddressClick }
						shipping={ true }
					/>
					<Addresses max={ 1 } formName="checkout-shipping-address" />
					{ isNewAddress && (
						<>
							<Checkbox
								checked={ isNeedSaveNewAddress }
								onChange={ () =>
									setIsNeedSaveNewAddress(
										! isNeedSaveNewAddress
									)
								}
							>
								Add this address to your account information
							</Checkbox>
						</>
					) }
					{ addressHasBeenChanged && (
						<>
							<Checkbox
								checked={ isNeedSaveAddress }
								onChange={ () =>
									setIsNeedSaveAddress( ! isNeedSaveAddress )
								}
							>
								Update this address to your account information
							</Checkbox>
						</>
					) }
					<Submit buttonTitle="Confirm address" />
				</Form>
			) }
		</>
	);
}
