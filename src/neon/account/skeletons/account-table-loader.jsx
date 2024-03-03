import ContentLoader from 'react-content-loader';

export const AccountTableLoader = () => {
	return (
		<div className="ant-table">
			<ContentLoader
				width={ '100%' }
				height={ 600 }
				backgroundColor="#f5f5f5"
				foregroundColor="#dbdbdb"
			>
				{ [ ...Array( 3 ).keys() ].map( ( i, index ) => (
					<rect
						x="0"
						y={ index * 320 }
						rx="3"
						ry="3"
						width="100%"
						height="300"
						key={ i }
					/>
				) ) }
			</ContentLoader>
		</div>
	);
};
