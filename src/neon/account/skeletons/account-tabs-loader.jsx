import ContentLoader from 'react-content-loader';

export const AccountTabsLoader = () => {
	return (
		<div className="ant-tabs">
			<ContentLoader height="145" width="100%">
				<rect x="0" y="27" rx="3" ry="3" width="90" height="40" />
				<rect x="100" y="27" rx="3" ry="3" width="90" height="40" />
				<rect x="200" y="27" rx="3" ry="3" width="90" height="40" />
				<rect x="0" y="90" rx="3" ry="3" width="200" height="33" />
			</ContentLoader>
		</div>
	);
};
