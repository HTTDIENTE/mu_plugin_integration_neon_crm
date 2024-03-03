import { useEffect, useRef, useState } from '@wordpress/element';
import { useEvents } from '../../../global/hooks/use-events';
import EventsItems from './events-items';
import EventsHeader from './events-header';
import Categories from './categories';
import EventsSearch from './events-search';
import EventsCalendar from './events-calendar';

let count = 0;

export default function Events( { months, setMonths, tab, setTab, searchByValue, setSearchByValue } ) {
	const [ events ] = useEvents();
	const [ scroll, setScroll ] = useState( null );
	const ref = useRef();

	const isCategories = !! events
		.map( ( event ) => event.categoryId )
		.filter( ( categoryId, i, a ) => a.indexOf( categoryId ) === i && Number( categoryId ) !== 0 )
		.length;

	useEffect( () => {
		if ( count >= 2 ) {
			ref.current.scrollIntoView( { behavior: 'smooth', block: 'start' } );
		} else {
			count += 1;
		}
	}, [ tab, months, scroll ] );

	return (
		<div ref={ ref }>
			<h1 className="neon-events__title">Events App</h1>
			<div className="events">
				<EventsHeader
					months={ months }
					setMonths={ setMonths }
					tab={ tab }
					setTab={ setTab }
					scroll={ scroll }
					setScroll={ setScroll }
				/>
				{ isCategories && <Categories events={ events } /> }
				{ tab === 'list' && (
					<EventsItems events={ events } months={ months } scroll={ scroll } setScroll={ setScroll } />
				) }
				{ tab === 'calendar' && (
					<EventsCalendar events={ events } months={ months } scroll={ scroll } setScroll={ setScroll } />
				) }
				{ tab === 'search' && <EventsSearch
					events={ events }
					scroll={ scroll }
					setScroll={ setScroll }
					searchByValue={ searchByValue }
					setSearchByValue={ setSearchByValue }
				/> }
			</div>
		</div>
	);
}
