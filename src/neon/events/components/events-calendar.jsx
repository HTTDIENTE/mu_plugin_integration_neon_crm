import moment from 'moment/moment';
import { useEffect, useState } from '@wordpress/element';
import dayjs from 'dayjs';
import { NavLink, useParams } from 'react-router-dom';
import { Calendar } from 'antd';
import { cleanForSlug } from '../../../global/scripts/clean-for-slug';
import '../styles/calendar.scss';

function isShow( categorySlug, event ) {
	return (
		'' === categorySlug ||
		categorySlug === cleanForSlug( event.categoryTitle )
	);
}

const getListData = ( value, events ) => {
	const listData = [];
	switch ( value.date() ) {
		case value.date():
			events
				.filter(
					( event ) =>
						value.date() ===
							+moment( event.startDatetimeGMT ).format( 'DD' ) &&
						value.month() ===
							+moment( event.startDatetimeGMT ).format( 'MM' ) -
								1 &&
						value.year() ===
							+moment( event.startDatetimeGMT ).format( 'YYYY' )
				)
				.map( ( item ) =>
					listData.push( {
						content: item.title,
						id: item.id,
						categoryTitle: item.categoryTitle,
					} )
				);
			break;
		default:
	}
	return listData || [];
};

export default function EventsCalendar( { events, months, scroll, setScroll } ) {
	const { categorySlug = '' } = useParams();
	const [ date, setDate ] = useState( () =>
		dayjs( moment( months ).format( 'YYYY-MM-DD' ) )
	);

	useEffect( () => {
		setDate( () => dayjs( moment( months ).format( 'YYYY-MM-DD' ) ) );
	}, [ months ] );

	useEffect( () => {
		setScroll( scroll + 1 );
	}, [ categorySlug ] );

	const dateCellRender = ( value ) => {
		const listData = getListData( value, events );
		return (
			<ul className="events__calendar-items">
				{ listData.map(
					( event, index ) =>
						isShow( categorySlug, event ) && (
							<li key={ index } className="events__calendar-item">
								<NavLink
									key={ index }
									to={ `/event/${ event.id }/` }
									state={ { fromEvents: true } }
									className="events__calendar-link"
								>
									{ event.content }
								</NavLink>
							</li>
						)
				) }
			</ul>
		);
	};
	return (
		<>
			<Calendar
				className="events__calendar"
				value={ date }
				dateCellRender={ dateCellRender }
			/>
		</>
	);
}
