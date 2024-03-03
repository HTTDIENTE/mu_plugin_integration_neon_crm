import moment from 'moment/moment';
import { Button } from 'antd';
import {
	ArrowRightOutlined,
	ArrowLeftOutlined,
	MenuOutlined,
	CalendarOutlined,
	SearchOutlined,
} from '@ant-design/icons';

export default function EventsHeader( { months, setMonths, tab, setTab, scroll, setScroll } ) {
	const handlerMonthChange = ( value ) => {
		setMonths( moment( months ).add( value, 'months' ) );
	};

	const handlerTabClick = ( value ) => {
		setTab( value );
		setScroll( scroll + 1 );
	};

	return (
		<div className="events__header">
			<div className="events__navigation">
				{ tab !== 'search' && (
					<>
						<Button
							icon={ <ArrowLeftOutlined /> }
							onClick={ () => handlerMonthChange( -1 ) }
						/>
						<Button
							icon={ <ArrowRightOutlined /> }
							onClick={ () => handlerMonthChange( +1 ) }
						/>
					</>
				) }
			</div>
			<div className="events__title">
				{ tab !== 'search' && months.format( 'MMMM, YYYY' ) }
				{ tab === 'search' && 'Search' }
			</div>
			<div className="events__navigation">
				<Button
					icon={ <MenuOutlined /> }
					onClick={ () => handlerTabClick( 'list' ) }
				/>
				<Button
					icon={ <CalendarOutlined /> }
					onClick={ () => handlerTabClick( 'calendar' ) }
				/>
				<Button
					icon={ <SearchOutlined /> }
					onClick={ () => handlerTabClick( 'search' ) }
				/>
			</div>
		</div>
	);
}
