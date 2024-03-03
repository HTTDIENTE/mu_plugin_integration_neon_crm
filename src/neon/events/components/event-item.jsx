import moment from 'moment/moment';
import { ClockCircleOutlined } from '@ant-design/icons';

export function EventItem( { event } ) {
	const startDate = moment( event.startDatetimeGMT );
	const endDate = moment( event.endDatetimeGMT );

	return (
		<div className="events__item">
			<div className="events__content">
				<h2 className="events__sub-title">{ event.title }</h2>
				<p className="events__summary">{ event.summary }</p>
			</div>
			<div className="events__date">
				<p className="events__date_day">{ startDate.format( 'DD' ) }</p>
				<p className="events__date_month">
					{ startDate.format( 'MMM' ) }
				</p>
				<p className="events__time">
					<ClockCircleOutlined />
					{ startDate.format( 'LT' ) }-{ endDate.format( 'LT' ) }
				</p>
			</div>
		</div>
	);
}
