import classNames from 'classnames';
import { FormItemFloatLabel } from './form-item-float-label';
import { useEffect, useState } from '@wordpress/element';
import {
	paymentFormLoad,
	toggle,
} from '../../../scripts/forms/payment-form-load';

export function Card( { id } ) {
	const [ validateStatus, setValidateStatus ] = useState( '' );
	const [ help, setHelp ] = useState( '' );
	const [ alwaysUsed, setAlwaysUsed ] = useState( false );

	useEffect( () => {
		paymentFormLoad().then( ( fields ) => {
			fields[ '#' + id ] = { setValidateStatus, setHelp, setAlwaysUsed };
		} );
	}, [ setValidateStatus, setHelp, setAlwaysUsed ] );

	return (
		<FormItemFloatLabel
			name="card"
			label="Card Fields"
			validateStatus={ validateStatus }
			help={ help }
			alwaysUsed={ alwaysUsed }
			required={ true }
			className="payment-form__card-field"
			onMouseOver={ ( event ) => {
				toggle( event.target.closest( '.payment-form__card-field' ) );
			} }
			onFocus={ ( event ) => {
				toggle( event.target.closest( '.payment-form__card-field' ) );
			} }
			tabIndex="0"
		>
			<div
				id={ id }
				className={ classNames( {
					'payment-form__card': true,
					'payment-form__card_error': 'error' === validateStatus,
				} ) }
			/>
		</FormItemFloatLabel>
	);
}
