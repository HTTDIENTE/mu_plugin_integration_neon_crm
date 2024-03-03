import { Address } from './address';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Form } from 'antd';
import { FormListPathContext } from '../../../contexts/form-list-path-context';

export const Addresses = ( { max, formName } ) => {
	const name = [ 'primaryContact', 'addresses' ];
	const form = Form.useFormInstance();
	const addresses = form.getFieldValue( name );

	/* We set at least one empty address if the user has no addresses yet. */
	if ( ! addresses ) {
		const defaultAddresses = [];
		defaultAddresses.push( {
			country: { id: '1' },
			isPrimaryAddress: true,
		} );

		form.setFieldValue( name, defaultAddresses );
	}

	return (
		<FormListPathContext.Provider value={ name }>
			<Form.List name={ name }>
				{ ( fields, { add, remove } ) => (
					<>
						{ fields.map( ( { key, name: index } ) => (
							<Address
								index={ index }
								remove={ remove }
								key={ key }
								formName={ formName }
							/>
						) ) }
						{ fields.length < max && (
							<Form.Item>
								<Button
									type="dashed"
									onClick={ () =>
										add( {
											country: { id: '1' },
											isPrimaryAddress: false,
										} )
									}
									block
									icon={ <PlusOutlined /> }
								>
									Add Address
								</Button>
							</Form.Item>
						) }
					</>
				) }
			</Form.List>
		</FormListPathContext.Provider>
	);
};
