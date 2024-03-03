import { Input } from 'antd';
import { FormItemFloatLabel } from './form-item-float-label';

export function Passwords() {
	return (
		<>
			<FormItemFloatLabel
				label="Password"
				name={ [ 'login', 'password' ] }
				onKeyDown={ ( event ) =>
					event.key === ' ' ? event.preventDefault() : false
				}
				rules={ [
					{
						required: true,
						message: 'Please input your password!',
					},
					{
						pattern: new RegExp( /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/ ),
						message:
							'Password must contain at least 8 characters, including at least one number, one letter',
					},
					{ min: '8' },
				] }
			>
				<Input.Password minLength={ 8 } autoComplete="new-password" />
			</FormItemFloatLabel>
			<FormItemFloatLabel
				label="Confirm Password"
				name={ [ 'login', 'confirm-password' ] }
				dependencies={ [ 'login', 'password' ] }
				rules={ [
					{
						required: true,
						message: 'Please confirm your password!',
					},
					( { getFieldValue } ) => ( {
						validator( _, value ) {
							if (
								! value ||
								getFieldValue( [ 'login', 'password' ] ) ===
									value
							) {
								return Promise.resolve();
							}
							return Promise.reject(
								new Error(
									'The two passwords that you entered do not match!'
								)
							);
						},
					} ),
				] }
			>
				<Input.Password autoComplete="new-password" />
			</FormItemFloatLabel>
		</>
	);
}
