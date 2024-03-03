import { Button } from 'antd';
import { nameFormat } from '../scripts/data-format/name-format';
import { addressFormat } from '../scripts/data-format/address-format';

export function SavedUserInformation( { userData, setIsEdit } ) {
	const name = nameFormat( userData?.primaryContact );
	const address = addressFormat( userData?.primaryContact?.addresses[ 0 ] );
	const phone = userData?.primaryContact?.addresses[ 0 ]?.phone1;

	return (
		<div className="saved-user-information">
			<p>Name: { name }</p>
			<p>Address: { address }</p>
			<p>Phone Number: { phone }</p>
			<Button
				className="saved-user-information__edit-btn"
				onClick={ () => setIsEdit( true ) }
			>
				Edit Information
			</Button>
		</div>
	);
}
