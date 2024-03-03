import { Button, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { addressFormat } from '../scripts/data-format/address-format';
import { useAccount } from '../hooks/use-account';

export default function DropdownSelectAddress( {
	handlerAddressClick,
	shipping,
} ) {
	const [ account ] = useAccount();
	const items = account.primaryContact.addresses.map( ( item, index ) => {
		return {
			key: index,
			label: (
				<Button onClick={ () => handlerAddressClick( index ) }>
					{ addressFormat( item ) }
				</Button>
			),
		};
	} );
	if ( shipping ) {
		items.push( {
			key: 'new',
			label: (
				<Button onClick={ () => handlerAddressClick( -1 ) }>
					Add New Address
				</Button>
			),
		} );
	}

	return (
		<div className="checkout__dropdown">
			<Dropdown menu={ { items } }>
				<Button>
					Select Address
					<DownOutlined />
				</Button>
			</Dropdown>
		</div>
	);
}
