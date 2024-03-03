import { useProducts } from '../../../global/hooks/use-products';
import Categories from './categories';
import { NavLink, useParams } from 'react-router-dom';
import ShopItem from './shop-item';
import { cleanForSlug } from '../../../global/scripts/clean-for-slug';

function isShow( categorySlug, product ) {
	return (
		'' === categorySlug ||
		categorySlug === cleanForSlug( product.categoryTitle )
	);
}

export default function Shop() {
	const [ products ] = useProducts();
	const { categorySlug = '' } = useParams();

	const isCategories = !! products
		.map( ( product ) => product.categoryId )
		.filter( ( categoryId, i, a ) => a.indexOf( categoryId ) === i && Number( categoryId ) !== 0 )
		.length;

	return (
		<div className="shop">
			<h1 className="shop__title">Shop App</h1>
			{ isCategories && <Categories products={ products } /> }
			<div className="shop__items">
				{ products.map(
					( product, index ) =>
						isShow( categorySlug, product ) && (
							<NavLink
								key={ index }
								to={ `/product/${ product.id }/` }
								state={ { fromShop: true } }
								className="shop__link"
							>
								<ShopItem product={ product } />
							</NavLink>
						)
				) }
			</div>
		</div>
	);
}
