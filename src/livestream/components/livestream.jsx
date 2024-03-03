import { useState } from '@wordpress/element';
import moment from 'moment/moment';
import { LivestreamVideo } from './livestream-video';
import { LivestreamSlider } from './livestream-slider';
import { LivestreamArchive } from './livestream-archive';
import { LivestreamNotFound } from './livestream-not-found';

export default function Livestream( { liveStreams } ) {
	const startDate = moment( moment().utc().format() ).add( -30, 'days' ).utc().format();
	const archiveItems = liveStreams.filter( ( item ) =>
		item.publishDatetimeGMT > startDate );

	const [ video, setVideo ] = useState( {
		url: liveStreams.length ? liveStreams[ liveStreams.length - 1 ].url : '',
		title: liveStreams.length ? liveStreams[ liveStreams.length - 1 ].title : '',
	} );

	return (
		<>
			<h1 className="livestream__title">Livestream App</h1>
			{ !! liveStreams.length &&
				<>
					<LivestreamVideo video={ video } />
					<LivestreamSlider
						archiveItems={ archiveItems }
						video={ video }
						setVideo={ setVideo }
					/>
					<LivestreamArchive liveStreams={ liveStreams } />
				</>
			}

			{ ! liveStreams.length && <LivestreamNotFound /> }
		</>
	);
}
