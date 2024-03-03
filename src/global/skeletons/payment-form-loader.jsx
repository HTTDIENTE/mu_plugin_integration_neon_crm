import ContentLoader from 'react-content-loader';

export const PaymentFormLoader = () => {
	return (
		<div className="ant-form">
			<ContentLoader height="246" width="100%">
				<rect x="0" y="0" width="25%" height="20" />
				<rect x="0" y="36" width="40%" height="20" />
				<rect x="0" y="72" width="75%" height="20" />
				<rect x="0" y="108" width="65%" height="20" />
				<rect x="0" y="145" width="144" height="32" />
				<rect x="0" y="192" width="50%" height="44" />
			</ContentLoader>
		</div>
	);
};
