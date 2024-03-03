import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function Email( { checkField, isAvailable, initialValueEmail } ) {
	return (
		<FormItemFloatLabel
			name={ [ 'primaryContact', 'email1' ] }
			label="E-mail"
			rules={ [
				{ type: 'email', required: true },
				!! checkField && !! initialValueEmail ? () => ( {
					validator( rule, value ) {
						if ( value === initialValueEmail || isAvailable ) {
							return Promise.resolve();
						}
						return Promise.reject( 'This email is already taken' );
					},
				} ) : false,
			] }
			onBlur={ checkField ? () => checkField( [ 'primaryContact', 'email1' ] ) : false }
		>
			<Input />
		</FormItemFloatLabel>
	);
}
