import ContentLoader from 'react-content-loader';

export const ProductLoader = () => {
	return (
		<ContentLoader
			width={ '100%' }
			height={ 500 }
			viewBox="0 0 700 300"
			backgroundColor="#f5f5f5"
			foregroundColor="#dbdbdb"
		>
			<rect x="12%" y="0" rx="5" ry="5" width="36%" height="270" />

			<rect x="370" y="10" rx="3" ry="3" width="30%" height="6" />
			<rect x="370" y="40" rx="3" ry="3" width="45%" height="25" />

			<rect x="370" y="90" rx="3" ry="3" width="150" height="7" />
			<rect x="370" y="110" rx="3" ry="3" width="100" height="7" />
			<rect x="370" y="130" rx="3" ry="3" width="178" height="7" />

			<rect x="370" y="155" rx="3" ry="3" width="70" height="20" />

			<rect x="370" y="205" rx="3" ry="3" width="20" height="10" />
			<rect x="400" y="200" rx="3" ry="3" width="70" height="20" />

			<rect x="370" y="235" rx="5" ry="5" width="90" height="25" />
			<rect x="470" y="235" rx="5" ry="5" width="90" height="25" />
		</ContentLoader>
	);
};
