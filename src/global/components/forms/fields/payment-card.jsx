import { useContext, useEffect, useState } from '@wordpress/element';
import {
	paymentFormLoadV2,
	toggleV2,
} from '../../../scripts/forms/payment-form-load-v2';
import classNames from 'classnames';
import { FormItemFloatLabel } from './form-item-float-label';
import { CartContext } from '../../../contexts/cart-context';

export function PaymentCard( { id, form } ) {
	const [ initiated, setInitiated ] = useState( false );
	const [ validateStatus, setValidateStatus ] = useState( '' );
	const [ help, setHelp ] = useState( '' );
	const [ alwaysUsed, setAlwaysUsed ] = useState( false );
	const { setCardComplete } = useContext( CartContext );

	useEffect( () => {
		paymentFormLoadV2().then( ( fields ) => {
			fields[ '#' + id ] = {
				setInitiated,
				setValidateStatus,
				setHelp,
				setAlwaysUsed,
				setCardComplete,
			};
		} );
	}, [ setInitiated, setValidateStatus, setHelp, setAlwaysUsed ] );

	return (
		<FormItemFloatLabel
			form={ form }
			name="card"
			label="Card Fields"
			validateStatus={ validateStatus }
			help={ help }
			alwaysUsed={ alwaysUsed }
			required={ true }
			className="payment-form__card-field"
			onMouseOver={ ( event ) => {
				toggleV2( event.target.closest( '.payment-form__card-field' ) );
			} }
			onFocus={ ( event ) => {
				toggleV2( event.target.closest( '.payment-form__card-field' ) );
			} }
			tabIndex="0"
			onBlur={ false }
		>
			<div
				id={ id }
				className={ classNames( {
					'payment-form__card': true,
					'payment-form__card_error': 'error' === validateStatus,
					'payment-form__card_initiated': initiated,
				} ) }
			/>
		</FormItemFloatLabel>
	);
}
