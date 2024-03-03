import { useContext } from '@wordpress/element';
import { Button, Form } from 'antd';
import {
	setValidateHelp,
	setValidateStatus,
} from '../../../scripts/forms/payment-form-load-v2';
import { paymentFormOnFinishV2 } from '../../../scripts/forms/payment-form-on-finish-v2';

export function PaymentSubmitForm( {
	onSubmitSuccess,
	onSubmitError,
	formName,
	buttonTitle,
	context,
} ) {
	const cardFieldId = formName + '-card-field';
	const { billingNames, billingAddress, form, messageApi, isComplete } =
		useContext( context );

	return (
		<Form
			form={ form }
			onFinish={ async () => {
				const field = document.querySelector( '#' + cardFieldId );
				if ( field ) {
					if (
						! field.classList.contains(
							'payment-form__card_initiated'
						)
					) {
						setValidateStatus( cardFieldId, 'error' );
						setValidateHelp(
							cardFieldId,
							'Card Fields is required!'
						);
						return;
					}
				} else {
					messageApi.open( {
						type: 'error',
						content:
							'The form could not be submitted because the payment field was not found.',
					} );
					return;
				}

				await paymentFormOnFinishV2(
					cardFieldId,
					billingAddress,
					billingNames,
					onSubmitSuccess,
					onSubmitError
				);
			} }
		>
			<Form.Item shouldUpdate>
				<Button
					type="primary"
					htmlType="submit"
					aria-disabled={ ! isComplete }
				>
					{ buttonTitle ? buttonTitle : 'Submit' }
					{ isComplete ? 'Complete' : 'Disabled' }
				</Button>
			</Form.Item>
		</Form>
	);
}
