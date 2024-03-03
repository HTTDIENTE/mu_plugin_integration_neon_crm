import moment from 'moment/moment';
import { NavLink } from 'react-router-dom';

function ItemsByMonth( { year, months, liveStreams } ) {
	return (
		<>
			{ months.filter( ( item ) => item.split( ' ' )[ 0 ] === year )
				.map( ( month, index ) => (
					<div className="livestream__month" key={ index }>
						<NavLink
							to={ `/archive/${ year }/${ month.split( ' ' )[ 1 ].toLowerCase() }` }
							state={ { fromLivestream: true } }
							className="livestream__link"
						>
							{ month.split( ' ' )[ 1 ] }
						</NavLink>
						{ liveStreams.filter( ( item ) => moment( item.publishDatetimeGMT ).format( 'YYYY MMMM' ) === month )
							.map( ( item ) => (
								<p className="livestream__name" key={ item.id }>
									{ item.title + ' - ' + moment( item.publishDatetimeGMT ).format( 'DD MMM YYYY LT' ) }
								</p>
							) )
						}
					</div> ) )
			}
		</>
	);
}

export function LivestreamArchive( { liveStreams } ) {
	const months = liveStreams
		.map( ( liveStream ) => moment( liveStream.publishDatetimeGMT ).format( 'YYYY MMMM' ) )
		.filter( ( date, i, a ) => a.indexOf( date ) === i );

	const years = months
		.map( ( month ) => month.split( ' ' )[ 0 ] )
		.filter( ( date, i, a ) => a.indexOf( date ) === i );

	return (
		<div className="livestream__archive">
			<h2 className="livestream__sub-title">Live Streams List</h2>

			{ years
				.map( ( year ) => (
					<div className="livestream__year" key={ year }>
						<h3 className="livestream__year-title">{ year }</h3>
						<ItemsByMonth year={ year } months={ months } liveStreams={ liveStreams } />
					</div> ) )
			}
		</div>
	);
}
