import { useOrders } from '../../../global/hooks/use-orders';
import { Order } from './order';

export default function Orders() {
	const [ orders ] = useOrders();
	const isEmptyOrders = ! orders.length;

	return (
		<div className="orders">
			<h2 className="orders__title">Orders</h2>
			{ orders.map( ( order ) => (
				<Order order={ order } key={ order.id } />
			) ) }
			{ isEmptyOrders && (
				<p className="orders__empty">Orders not found</p>
			) }
		</div>
	);
}
