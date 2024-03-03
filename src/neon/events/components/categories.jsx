import { NavLink } from 'react-router-dom';
import { cleanForSlug } from '../../../global/scripts/clean-for-slug';

export default function Categories( { events } ) {
	const categories = [ { title: 'All', path: '/' } ];

	events
		.map( ( event ) => event.categoryTitle )
		.filter( ( categoryTitle, i, a ) => a.indexOf( categoryTitle ) === i && categoryTitle !== '' )
		.forEach( ( categoryTitle ) => {
			categories.push( {
				title: categoryTitle,
				path: `/category/${ cleanForSlug( categoryTitle ) }/`,
			} );
		} );

	return (
		<div className="events__categories">
			{ categories.map( ( category, index ) => (
				<NavLink
					key={ index }
					to={ category.path }
					className="events__category-btn"
				>
					{ category.title }
				</NavLink>
			) ) }
		</div>
	);
}
