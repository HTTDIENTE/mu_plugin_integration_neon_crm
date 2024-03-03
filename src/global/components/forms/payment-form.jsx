import { Form } from 'antd';
import { validateMessages } from '../../scripts/forms/values-config';
import { useState } from '@wordpress/element';
import { FirstName } from './fields/first-name';
import { MiddleName } from './fields/middle-name';
import { LastName } from './fields/last-name';
import { Email } from './fields/email';
import { Submit } from './fields/submit';
import { useAccount } from '../../hooks/use-account';
import { Addresses } from './fields/addresses';
import { Card } from './fields/card';
import { paymentFormOnFinish } from '../../scripts/forms/payment-form-on-finish';
import { Agreement } from './fields/agreement';
import { SavedUserInformation } from '../saved-user-information';
import DropdownSelectAddress from '../dropdown-select-address';
import { isMissingData } from '../../scripts/data-format/is-missing-data';
import '../../styles/payment-form.scss';

export function PaymentForm( {
	onSubmitSuccess,
	onSubmitError,
	formName,
	buttonTitle,
	formFooter,
	agreement,
} ) {
	const [ form ] = Form.useForm();
	const [ account ] = useAccount();
	const cardFieldId = formName + '-card-field';
	const addressData = {
		primaryContact: {
			...account.primaryContact,
			addresses: account.primaryContact?.addresses?.filter(
				( item ) => item.isPrimaryAddress
			),
		},
	};
	const [ isEdit, setIsEdit ] = useState( isMissingData( addressData ) );

	const handlerAddressClick = ( index ) => {
		const currentAddress = { ...account.primaryContact.addresses[ index ] };
		for ( const key in currentAddress ) {
			form.setFieldValue(
				[ 'primaryContact', 'addresses', '0', key ],
				currentAddress[ key ]
			);
		}
	};

	return (
		<Form
			form={ form }
			onFinish={ async ( values ) => {
				delete values.card;

				await paymentFormOnFinish(
					cardFieldId,
					Object.keys( values ).length ? values : addressData,
					onSubmitSuccess,
					onSubmitError
				);
			} }
			initialValues={ addressData }
			validateMessages={ validateMessages }
			className="payment-form"
			scrollToFirstError
		>
			<Card id={ cardFieldId } />
			{ ! isEdit && (
				<>
					<SavedUserInformation
						userData={ addressData }
						setIsEdit={ setIsEdit }
					/>
				</>
			) }
			{ isEdit && (
				<>
					<DropdownSelectAddress
						handlerAddressClick={ handlerAddressClick }
					/>
					<FirstName />
					<MiddleName />
					<LastName />
					<Email />
					<Addresses max={ 1 } formName="payment-form" />
					{ agreement && <Agreement /> }
				</>
			) }
			{ formFooter ? (
				<div className="form-footer">
					{ formFooter }
					<div className="form-footer__item">
						<Submit buttonTitle={ buttonTitle } />
					</div>
				</div>
			) : (
				<Submit buttonTitle={ buttonTitle } />
			) }
		</Form>
	);
}
