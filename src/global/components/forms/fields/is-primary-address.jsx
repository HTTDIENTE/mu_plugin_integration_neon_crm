import { Form, Input } from 'antd';

function handlerChangePrimaryAddress( form, index ) {
	const addresses = form.getFieldValue( [ 'primaryContact', 'addresses' ] );
	addresses.forEach( ( address, addressIndex ) => {
		if ( address?.isPrimaryAddress ) {
			address.isPrimaryAddress = false;
		}

		if ( index === addressIndex ) {
			address.isPrimaryAddress = true;
		}
	} );

	form.setFieldValue( [ 'primaryContact', 'addresses' ], addresses );
}

function validatePrimaryAddress( form ) {
	const addresses = form.getFieldValue( [ 'primaryContact', 'addresses' ] );
	for ( const address of addresses ) {
		if ( address?.isPrimaryAddress ) {
			return Promise.resolve();
		}
	}

	return Promise.reject( 'Choose a primary address!' );
}

export function IsPrimaryAddress( { index } ) {
	const form = Form.useFormInstance();

	return (
		<>
			<Form.Item
				name={ [ index, 'isPrimaryAddress' ] }
				label="Set as Primary Address"
				valuePropName="checked"
				rules={ [
					{
						validator() {
							return validatePrimaryAddress( form );
						},
					},
				] }
			>
				<Input
					name="isPrimaryAddress"
					type="radio"
					value={ true }
					onChange={ () =>
						handlerChangePrimaryAddress( form, index )
					}
				/>
			</Form.Item>
		</>
	);
}
