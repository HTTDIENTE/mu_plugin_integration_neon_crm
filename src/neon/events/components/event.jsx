import { Button, message } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useEffect, useRef } from '@wordpress/element';
import moment from 'moment/moment';
import { useGaPageView } from '../../../global/hooks/use-ga-page-view';
import { getEvent } from '../../../global/scripts/storage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import EventRegistration from './event-registration';

export default function Event() {
	useGaPageView();
	const event = getEvent( useParams().eventId );
	const navigate = useNavigate();
	const location = useLocation();
	const startDate = moment( event.startDatetimeGMT );
	const endDate = moment( event.endDatetimeGMT );
	const [ messageApi, contextHolder ] = message.useMessage();
	const ref = useRef();

	useEffect( () => {
		ref.current.scrollIntoView( { behavior: 'smooth', block: 'start' } );
	}, [] );

	const backHandle = () => {
		if ( location.state?.fromEvents ) {
			navigate( -1 );
		} else {
			navigate( '/' );
		}
	};

	return (
		<>
			{ contextHolder }
			<div className="event" ref={ ref }>
				<Button
					className="event__back-btn"
					icon={ <ArrowLeftOutlined /> }
					onClick={ backHandle }
				/>
				<div className="event__wrapper">
					<div className="event__left">
						<h2 className="event__title">{ event.title }</h2>
					</div>
					<div className="event__right">
						<p className="event__day">
							{ startDate.format( 'DD' ) }
						</p>
						<p className="event__month">
							{ startDate.format( 'MMM' ) }
						</p>
						<p className="event__time">
							<ClockCircleOutlined />
							{ startDate.format( 'LT' ) }-
							{ endDate.format( 'LT' ) }
						</p>
					</div>
				</div>
				<div className="event__content">
					<p className="event__summary">{ event.summary }</p>
					<div className="event__description">
						{ !! event.description && event.description.replaceAll( /<[^>]*>/g, '' ) }
					</div>
				</div>
				<EventRegistration event={ event } messageApi={ messageApi } />
			</div>
		</>
	);
}
