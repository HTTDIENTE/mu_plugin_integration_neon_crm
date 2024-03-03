import ContentLoader from 'react-content-loader';

export const CardLoader = () => {
	const width = 285;
	const height = 517;
	const padding = 24;
	const innerWidth = width - padding * 2;
	return (
		<ContentLoader
			width={ width }
			height={ height }
			viewBox={ `0 0 ${ width } ${ height }` }
			style={ { width: '100%', height: 'auto' } }
		>
			<rect
				x={ padding }
				y="30"
				rx="5"
				ry="5"
				width={ innerWidth }
				height="20"
			/>
			<rect x="0" y="70" width={ width } height={ width } />
			<rect
				x={ padding }
				y={ width + 90 }
				rx="5"
				ry="5"
				width={ innerWidth }
				height="15"
			/>
			<rect
				x={ padding }
				y={ width + 115 }
				rx="5"
				ry="5"
				width={ innerWidth }
				height="15"
			/>
			<rect
				x={ padding }
				y={ width + 140 }
				rx="5"
				ry="5"
				width={ innerWidth }
				height="15"
			/>
			<rect
				x={ padding }
				y={ width + 170 }
				rx="5"
				ry="5"
				width={ innerWidth }
				height="15"
			/>
			<rect
				x={ padding }
				y={ width + 195 }
				rx="5"
				ry="5"
				width={ innerWidth }
				height="15"
			/>
		</ContentLoader>
	);
};
