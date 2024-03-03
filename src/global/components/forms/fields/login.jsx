import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function Login( { checkField, isAvailable, initialValueUsername } ) {
	return (
		<FormItemFloatLabel
			name={ [ 'login', 'username' ] }
			label="User Login"
			rules={ [
				{ required: true },
				!! checkField && !! initialValueUsername ? () => ( {
					validator( rule, value ) {
						if ( value === initialValueUsername || isAvailable ) {
							return Promise.resolve();
						}
						return Promise.reject( 'This name is already taken' );
					},
				} ) : false,
			] }
			onBlur={ checkField ? () => checkField( [ 'login', 'username' ] ) : false }
		>
			<Input />
		</FormItemFloatLabel>
	);
}
