import { Phone } from './phone';
import { ZipCode } from './zip-code';
import { MinusCircleOutlined } from '@ant-design/icons';
import { AddressLine1 } from './address-line-1';
import { AddressLine2 } from './address-line-2';
import { City } from './city';
import { StateProvince } from './state-province';
import { Country } from './country';
import { AddressId } from './address-id';
import { IsPrimaryAddress } from './is-primary-address';

export function Address( { index, remove, formName } ) {
	return (
		<fieldset
			style={ {
				display: 'block',
				width: '100%',
				justifyContent: 'center',
				marginTop: 20,
				border: 'none',
				padding: 0,
			} }
		>
			<legend
				className={ 'screen-read-text' }
				style={ {
					display: 'block',
					border: 'none',
				} }
			>
				Address { index ? index : '' }
			</legend>
			{ index !== 0 && (
				<MinusCircleOutlined onClick={ () => remove( index ) } />
			) }

			<Country index={ index } />
			<AddressLine1 index={ index } />
			<AddressLine2 index={ index } />
			<City index={ index } />
			<StateProvince index={ index } />
			<ZipCode index={ index } />
			<Phone index={ index } />
			<AddressId index={ index } />
			{ formName === 'edit-account-form' && (
				<IsPrimaryAddress index={ index } />
			) }
		</fieldset>
	);
}
