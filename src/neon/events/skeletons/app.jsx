import ContentLoader from 'react-content-loader';
import moment from 'moment/moment';

const eventsUrl = global.neon.pages.events;
const eventRegExp = new RegExp( `^${ eventsUrl }event/[0-9]+/` );
const isEvent = eventRegExp.test( global.location.pathname );

function Events() {
	return (
		<>
			<h1 className="neon-events__title">Events App</h1>
			<div className="events">
				<div className="events__header">
					<div className="events__navigation">
						<ContentLoader height="32" width="70">
							<rect x="0" width="32" height="32" />
							<rect x="37" width="32" height="32" />
						</ContentLoader>
					</div>
					<div className="events__title">
						{ moment().format( 'MMMM, YYYY' ) }
					</div>
					<div className="events__navigation">
						<ContentLoader height="32" width="106">
							<rect x="0" width="32" height="32" />
							<rect x="37" width="32" height="32" />
							<rect x="74" width="32" height="32" />
						</ContentLoader>
					</div>
				</div>
				<div className="events__categories">
					<ContentLoader width="450" height="34">
						<rect width="70" height="34" />
						<rect x="80" width="120" height="34" />
						<rect x="210" width="120" height="34" />
						<rect x="340" width="120" height="34" />
					</ContentLoader>
				</div>
				<div className="events__items">
					{ [ ...Array( 3 ).keys() ].map( ( i ) => (
						<div className="events__link" key={ i }>
							<ContentLoader height="185" width="100%">
								<rect x="0" width="100%" height="185" />
							</ContentLoader>
						</div>
					) ) }
				</div>
			</div>
		</>
	);
}

export function Event() {
	return (
		<>
			<div className="event">
				<div className="event__back-btn">
					<ContentLoader height="32" width="32">
						<rect width="32" height="32" />
					</ContentLoader>
				</div>
				<div className="event__wrapper">
					<div className="event__left">
						<ContentLoader height="120" width="100%">
							<rect rx="2" ry="2" width="95%" height="30" />
							<rect
								rx="2"
								ry="2"
								y="45"
								width="95%"
								height="30"
							/>
							<rect
								rx="2"
								ry="2"
								y="90"
								width="95%"
								height="30"
							/>
						</ContentLoader>
					</div>
					<div className="event__right">
						<p className="event__day">
							<ContentLoader height="32" width="40">
								<rect rx="2" ry="2" width="40" height="32" />
							</ContentLoader>
						</p>
						<p className="event__month">
							<ContentLoader height="27" width="50">
								<rect rx="2" ry="2" width="50" height="27" />
							</ContentLoader>
						</p>
						<p className="event__time">
							<ContentLoader height="12" width="80%">
								<rect rx="2" ry="2" width="100%" height="12" />
							</ContentLoader>
						</p>
					</div>
				</div>
				<div className="event__content">
					<ContentLoader height="110" width="100%">
						<rect rx="2" ry="2" width="100%" height="20" />
						<rect rx="2" ry="2" y="30" width="100%" height="20" />
						<rect rx="2" ry="2" y="60" width="100%" height="20" />
						<rect rx="2" ry="2" y="90" width="100%" height="20" />
					</ContentLoader>
				</div>
			</div>
		</>
	);
}

export function App() {
	if ( isEvent ) {
		return <Event />;
	}

	return <Events />;
}
