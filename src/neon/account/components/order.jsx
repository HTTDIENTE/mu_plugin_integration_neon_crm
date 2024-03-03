import { Table } from 'antd';
import { parseZone } from 'moment/moment';
import { priceFormat } from '../../../global/scripts/data-format/price-format';

const columns = [
	{
		title: 'Id',
		dataIndex: 'id',
		key: 'id',
	},
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
	},
	{
		title: 'Type',
		dataIndex: 'type',
		key: 'type',
	},
	{
		title: 'QTY',
		dataIndex: 'qty',
		key: 'qty',
	},
	{
		title: 'Price',
		dataIndex: 'price',
		key: 'price',
	},
	{
		title: 'Total  Price',
		dataIndex: 'totalPrice',
		key: 'totalPrice',
	},
];

export function Order( props ) {
	const data = props.order.items.map( ( item ) => {
		return {
			key: item.id,
			id: item.id,
			name:
				item.type.toLowerCase() === 'product' ? <a
					href={ `/product/${ Number( item.id ) }/` }
					className="orders__link"
				>
					{ item.name }
				</a> : item.name,
			type: item.type,
			qty: item.quantity,
			price: priceFormat( item.unitPrice ),
			totalPrice: priceFormat( item.price ),
		};
	} );

	const localDate = parseZone( props.order.timestamps.createdDateTime )
		.local()
		.format( 'dddd, MMMM Do YYYY' );

	const title = () => {
		return (
			<>
				<h3 className="orders__subtitle">{ `ORDER NUMBER #${ props.order.id }` }</h3>
				<span>{ localDate }</span>
			</>
		);
	};

	return (
		<>
			<Table
				columns={ columns }
				dataSource={ data }
				pagination={ false }
				style={ { marginBottom: 20 } }
				title={ title }
				summary={ () => {
					return (
						<>
							<Table.Summary.Row>
								<Table.Summary.Cell colSpan={ 5 }>
									SubTotal
								</Table.Summary.Cell>
								<Table.Summary.Cell>
									{ priceFormat( props.order.subTotal ) }
								</Table.Summary.Cell>
							</Table.Summary.Row>
							<Table.Summary.Row>
								<Table.Summary.Cell colSpan={ 5 }>
									Tax
								</Table.Summary.Cell>
								<Table.Summary.Cell>
									{ priceFormat( props.order.tax ) }
								</Table.Summary.Cell>
							</Table.Summary.Row>
							{ !! props.order.shippingHandlingFee && <Table.Summary.Row>
								<Table.Summary.Cell colSpan={ 5 }>
									Shipping
								</Table.Summary.Cell>
								<Table.Summary.Cell>
									{ priceFormat( props.order.shippingHandlingFee ) }
								</Table.Summary.Cell>
							</Table.Summary.Row> }
							<Table.Summary.Row>
								<Table.Summary.Cell colSpan={ 5 }>
									Total
								</Table.Summary.Cell>
								<Table.Summary.Cell>
									{ priceFormat( props.order.totalCharge ) }
								</Table.Summary.Cell>
							</Table.Summary.Row>
						</>
					);
				} }
			/>
		</>
	);
}
