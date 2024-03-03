import { AppWrapper } from '../../global/components/app-wrapper';
import { lazy, Suspense } from '@wordpress/element';

const DonationLazy = lazy( () =>
	import( /* webpackChunkName: "account-form" */ './components/donation' )
);

export default function App() {
	return (
		<AppWrapper>
			<>
				<h1 className="neon-donations__title">Donation</h1>
				<Suspense>
					<DonationLazy />
				</Suspense>
			</>
		</AppWrapper>
	);
}
