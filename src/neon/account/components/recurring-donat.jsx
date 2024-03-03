import { Table } from 'antd';
import { EditRecurringDonat } from './edit-recurring-donat';
import { parseZone } from 'moment/moment';
import { deleteRecurringDonation } from '../scripts/delete-recurring-donation';
import { useContext } from '@wordpress/element';
import { EditRecurringDonationContext } from '../../../global/contexts/edit-recurring-donation-context';
import { paymentFormLoad } from '../../../global/scripts/forms/payment-form-load';

export function RecurringDonat( { donat, messageApi } ) {
	const { editRecurringDonationId, setEditRecurringDonationId } = useContext(
		EditRecurringDonationContext
	);

	const columns = [
		{
			title: 'Id',
			dataIndex: 'id',
			key: 'id',
		},
		{
			title: 'Amount',
			dataIndex: 'amount',
			key: 'amount',
		},
		{
			title: 'Frequency',
			dataIndex: 'frequency',
			key: 'frequency',
		},
		{
			title: 'Next Date',
			dataIndex: 'nextDate',
			key: 'nextDate',
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
			render: () => (
				<button
					className="recurring-donat__delete"
					onClick={ async () => {
						await deleteRecurringDonation( donat.id, messageApi );
						if ( donat.id === editRecurringDonationId ) {
							setEditRecurringDonationId( '' );
						}
					} }
				>
					Delete
				</button>
			),
		},
	];

	donat.key = donat.id;
	const data = Object.assign( {}, donat );
	data.nextDate = parseZone( donat.nextDate )
		.local()
		.format( 'dddd, MMMM Do YYYY' );

	return (
		<div className="recurring-donat">
			<Table
				columns={ columns }
				dataSource={ [ data ] }
				pagination={ false }
				title={ () => `DONATION NUMBER #${ donat.id }` }
				onMouseEnter={ async () => await paymentFormLoad() }
				footer={ () => (
					<EditRecurringDonat
						donat={ donat }
						messageApi={ messageApi }
					/>
				) }
			/>
		</div>
	);
}
