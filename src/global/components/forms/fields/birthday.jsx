import { Input } from 'antd';
import { today } from '../../../scripts/forms/properties';
import { FormItemFloatLabel } from './form-item-float-label';

export function Birthday() {
	return (
		<FormItemFloatLabel
			label="Birthday"
			name={ [ 'primaryContact', 'dob' ] }
			alwaysUsed={ true }
			normalize={ ( value ) => {
				const birthday = value.split( '-' );

				return {
					day: birthday[ 2 ],
					month: birthday[ 1 ],
					year: birthday[ 0 ],
				};
			} }
			getValueProps={ ( value ) => {
				if ( value?.year && value?.month && value?.day ) {
					return {
						value: value.year + '-' + value.month + '-' + value.day,
					};
				}

				return {
					value: undefined,
				};
			} }
			rules={ [
				{ required: true },
				{
					validator: ( _, value ) => {
						if ( value ) {
							const year = Number( value.year );
							const currentDate = new Date();
							const birthDate = new Date(
								value.day,
								value.month - 1,
								value.year,
								currentDate.getHours(),
								currentDate.getMinutes(),
								currentDate.getSeconds()
							);
							if (
								year.length > 4 ||
								year < 1900 ||
								birthDate - currentDate > 5000
							) {
								return Promise.reject(
									'Invalid date of birth'
								);
							}
						}

						return Promise.resolve();
					},
				},
			] }
		>
			<Input type="date" max={ today } />
		</FormItemFloatLabel>
	);
}
