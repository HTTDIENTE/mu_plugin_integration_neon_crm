import ContentLoader from 'react-content-loader';

export const AccountFormLoader = () => {
	return (
		<div className="ant-form">
			<ContentLoader
				width={ '100%' }
				height={ 600 }
				backgroundColor="#f5f5f5"
				foregroundColor="#dbdbdb"
			>
				{ [ ...Array( 10 ).keys() ].map( ( i, index ) => (
					<rect
						x="0"
						y={ index * 68 }
						rx="3"
						ry="3"
						width="100%"
						height="44"
						key={ i }
					/>
				) ) }
			</ContentLoader>
		</div>
	);
};
