import { NavLink } from 'react-router-dom';
import { cleanForSlug } from '../../../global/scripts/clean-for-slug';

export default function Categories( { products } ) {
	const categories = [ { title: 'All', path: '/' } ];

	products
		.map( ( product ) => product.categoryTitle )
		.filter( ( categoryTitle, i, a ) => a.indexOf( categoryTitle ) === i && categoryTitle !== '' )
		.forEach( ( categoryTitle ) => {
			categories.push( {
				title: categoryTitle,
				path: `/category/${ cleanForSlug( categoryTitle ) }/`,
			} );
		} );

	return (
		<div className="shop__categories">
			{ categories.map( ( category, index ) => (
				<NavLink
					key={ index }
					to={ category.path }
					className="shop__category-btn"
				>
					{ category.title }
				</NavLink>
			) ) }
		</div>
	);
}
