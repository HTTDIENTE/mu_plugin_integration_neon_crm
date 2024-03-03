import ContentLoader from 'react-content-loader';

export const DonationAmountFormLoader = () => {
	return (
		<div className="donation__amount-form">
			<h3 className="donation__form-title">Donation Amount</h3>
			<ContentLoader
				height="124"
				width="100%"
				backgroundColor="#f5f5f5"
				foregroundColor="#dbdbdb"
			>
				<rect x="0" y="2" width="50" height="30" />
				<rect x="60" y="2" width="50" height="30" />
				<rect x="120" y="2" width="50" height="30" />
				<rect x="180" y="2" width="50" height="30" />
				<rect x="0" y="56" width="100%" height="44" />
			</ContentLoader>
			<h3 className="donation__form-title">Giving Type</h3>
			<ContentLoader height="214" width="100%">
				<rect x="0" width="100%" height="66" />
				<rect x="0" y="86" width="100%" height="128" />
			</ContentLoader>
		</div>
	);
};
