import { Tabs } from 'antd';
import { Suspense, lazy } from '@wordpress/element';
import { AccountFormLoader } from '../skeletons/account-form-loader';
import { AccountTableLoader } from '../skeletons/account-table-loader';

const EditAccountLazy = lazy( () =>
	import( /* webpackChunkName: "edit-account-tab" */ './edit-account' )
);

const OrdersLazy = lazy( () =>
	import( /* webpackChunkName: "account-orders-tab" */ './orders' )
);

const RecurringDonationsLazy = lazy( () =>
	import(
		/* webpackChunkName: "account-recurring-donations-tab" */ './recurring-donations'
	)
);

export default function Account() {
	const items = [
		{
			label: 'Edit Account',
			key: '1',
			children: (
				<Suspense
					fallback={
						<div className="edit-account">
							<h2 className="edit-account__title">
								Edit Account
							</h2>
							<AccountFormLoader />
						</div>
					}
				>
					<EditAccountLazy />
				</Suspense>
			),
		},
		{
			label: 'Orders',
			key: '2',
			children: (
				<Suspense
					fallback={
						<div className="orders">
							<h2 className="orders__title">Orders</h2>
							<AccountTableLoader />
						</div>
					}
				>
					<OrdersLazy />
				</Suspense>
			),
		},
		{
			label: 'Recurring Donation',
			key: '3',
			children: (
				<Suspense
					fallback={
						<div className="recurring-donations">
							<h2 className="recurring-donations__title">
								Recurring donations
							</h2>
							<AccountTableLoader />
						</div>
					}
				>
					<RecurringDonationsLazy />
				</Suspense>
			),
		},
	];

	return (
		<div className="account">
			<h1 className="account__title">Account App</h1>
			<Tabs items={ items } />
		</div>
	);
}
