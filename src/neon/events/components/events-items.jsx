import { NavLink, useParams } from 'react-router-dom';
import { EventItem } from './event-item';
import { cleanForSlug } from '../../../global/scripts/clean-for-slug';
import moment from 'moment/moment';
import { useEffect } from '@wordpress/element';

function isShow( categorySlug, event, months, searchByValue, search ) {
	let hasSearchValue = true;
	const isMatchedMonth = months
		? moment( months ).format( 'MMMM' ) ===
				moment( event.startDatetimeGMT ).format( 'MMMM' ) &&
		moment( months ).format( 'YYYY' ) ===
				moment( event.startDatetimeGMT ).format( 'YYYY' )
		: true;

	if ( search ) {
		hasSearchValue = searchByValue
			? event.title.toLowerCase().includes( searchByValue ) ||
			event.summary.toLowerCase().includes( searchByValue ) ||
			event.description.toLowerCase().includes( searchByValue )
			: false;
	}

	return (
		( '' === categorySlug ||
			categorySlug === cleanForSlug( event.categoryTitle ) ) &&
		isMatchedMonth &&
		hasSearchValue
	);
}

export default function EventsItems( {
	events,
	months,
	searchByValue,
	search,
	scroll,
	setScroll,
} ) {
	const { categorySlug = '' } = useParams();

	const showEvents = events
		.filter( ( event ) =>
			isShow( categorySlug, event, months, searchByValue, search )
		)
		.sort( function( a, b ) {
			if (
				moment( a.startDatetimeGMT ).format( 'DD' ) >
				moment( b.startDatetimeGMT ).format( 'DD' )
			) {
				return 1;
			}
			if (
				moment( a.startDatetimeGMT ).format( 'DD' ) <
				moment( b.startDatetimeGMT ).format( 'DD' )
			) {
				return -1;
			}
			return 0;
		} );

	useEffect( () => {
		setScroll( scroll + 1 );
	}, [ categorySlug ] );

	return (
		<div className="events__items">
			{ !! showEvents.length && showEvents.map( ( event, index ) => (
				<NavLink
					key={ index }
					to={ `/event/${ event.id }/` }
					state={ { fromEvents: true } }
					className="events__link"
				>
					<EventItem event={ event } />
				</NavLink>
			) ) }
			{ ! showEvents.length &&
				( searchByValue || searchByValue === undefined ) && (
				<div>Events not found</div>
			) }
		</div>
	);
}
