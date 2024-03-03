import ContentLoader from 'react-content-loader';
import { CardLoader } from './card-loader';

const shopUrl = global.neon.pages.onlineStore;
const productRegExp = new RegExp( `^${ shopUrl }product/[0-9]+/` );
const isProduct = productRegExp.test( global.location.pathname );

function Shop() {
	return (
		<div className="shop">
			<h1 className="shop__title">Shop App</h1>
			<div className="shop__categories">
				<ContentLoader height="36" width="100%">
					<rect width="60" height="36" />
					<rect x="70" width="80" height="36" />
					<rect x="160" width="80" height="36" />
					<rect x="250" width="80" height="36" />
				</ContentLoader>
			</div>
			<div className="shop__items">
				{ [ ...Array( 8 ).keys() ].map( ( i ) => (
					<div className="shop__link" key={ i }>
						<CardLoader />
					</div>
				) ) }
			</div>
		</div>
	);
}

function Product() {
	return (
		<>
			<div className="product">
				<div className="product__images">
					<div className="ant-image">
						<ContentLoader height="396" width="396">
							<rect height="396" width="396" />
						</ContentLoader>
					</div>
				</div>
				<div className="product__content">
					<ContentLoader height="100%" width="100%">
						<rect width="200" height="24" />
						<rect y="39" width="400" height="40" />
						<rect y="108" width="300" height="24" />
						<rect y="147" width="40" height="24" />
						<rect y="194" width="26" height="16" />
						<rect y="187" x="39" width="88" height="30" />
						<rect y="238" width="152" height="53" />
						<rect y="246" x="178" width="149" height="38" />
					</ContentLoader>
				</div>
			</div>
		</>
	);
}

export function App() {
	if ( isProduct ) {
		return <Product />;
	}

	return <Shop />;
}
