import Search from 'antd/es/input/Search';
import EventsItems from './events-items';

export default function EventsSearch( { events, scroll, setScroll, searchByValue, setSearchByValue } ) {
	return (
		<>
			<Search
				onSearch={ ( value ) =>
					setSearchByValue( value.toLowerCase() )
				}
				onChange={ ( e ) =>
					setSearchByValue( e.target.value ) }
				value={ searchByValue }
			/>
			<EventsItems
				events={ events }
				searchByValue={ searchByValue }
				search={ true }
				scroll={ scroll }
				setScroll={ setScroll }
			/>
		</>
	);
}
