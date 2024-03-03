import '../styles/preloader.scss';

const PreloaderItem = () => {
	return (
		<div className="preloader__item">
			<span className="preloader__dot" />
		</div>
	);
};

export default function Preloader() {
	return (
		<>
			<div className="preloader">
				<div className="preloader__items">
					{ [ ...Array( 12 ).keys() ].map( ( i ) => (
						<PreloaderItem key={ i } />
					) ) }
				</div>
			</div>
		</>
	);
}
