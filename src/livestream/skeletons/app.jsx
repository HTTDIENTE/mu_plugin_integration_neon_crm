import ContentLoader from 'react-content-loader';

export function App() {
	return (
		<div className="livestream ">
			<h1 className="livestream__title">
				<ContentLoader height="36" width="25%">
					<rect rx="2" ry="2" height="36" width="100%" />
				</ContentLoader>
			</h1>
			<div className="livestream__video">
				<ContentLoader height="100%" width="100%">
					<rect height="100%" width="100%" />
				</ContentLoader>
			</div>
			<div className="livestream__slider">
				<h2 className="livestream__sub-title">
					<ContentLoader height="27" width="50%">
						<rect rx="2" ry="2" height="27" width="100%" />
					</ContentLoader>
				</h2>
				<div className="livestream__wrapper">
					{ [ ...Array( 4 ).keys() ].map( ( i ) => (
						<div className="livestream__slide" key={ i }>
							<div className="livestream__image">
								<ContentLoader height="300" width="100%">
									<rect height="100%" width="100%" />
								</ContentLoader>
							</div>
							<h3 className="livestream__slide-title">
								<ContentLoader height="18" width="50%">
									<rect rx="2" ry="2" height="18" width="100%" />
								</ContentLoader>
							</h3>
							<h4 className="livestream__date">
								<ContentLoader height="16" width="70%">
									<rect rx="2" ry="2" height="16" width="100%" />
								</ContentLoader>
							</h4>
						</div>
					) ) }
				</div>
			</div>
			<div className="livestream__archive">
				<h2 className="livestream__sub-title">
					<ContentLoader height="27" width="30%">
						<rect rx="2" ry="2" height="27" width="100%" />
					</ContentLoader>
				</h2>
				<div className="livestream__year">
					<h3 className="livestream__year-title">
						<ContentLoader height="21" width="70">
							<rect rx="2" ry="2" height="21" width="100%" />
						</ContentLoader>
					</h3>
					<div className="livestream__month">
						<div className="livestream__link">
							<ContentLoader height="18" width="120">
								<rect rx="2" ry="2" height="16" width="100%" />
							</ContentLoader>
						</div>
						<p className="livestream__name">
							<ContentLoader height="18" width="40%">
								<rect rx="2" ry="2" height="16" width="100%" />
							</ContentLoader>
						</p>
						<p className="livestream__name">
							<ContentLoader height="18" width="40%">
								<rect rx="2" ry="2" height="16" width="100%" />
							</ContentLoader>
						</p>
						<p className="livestream__name">
							<ContentLoader height="18" width="40%">
								<rect rx="2" ry="2" height="16" width="100%" />
							</ContentLoader>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
