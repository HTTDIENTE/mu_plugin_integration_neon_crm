import { useEffect, useRef, useState } from '@wordpress/element';
import moment from 'moment/moment';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LivestreamVideo } from './livestream-video';
import { LivestreamSlider } from './livestream-slider';

export default function LivestreamMonth( { liveStreams } ) {
	const navigate = useNavigate();
	const location = useLocation();
	const month = useParams().month;
	const year = useParams().year;
	const ref = useRef();

	const archiveItems = liveStreams.filter( ( item ) =>
		moment( item.publishDatetimeGMT ).format( 'YYYY MMMM' ).toLowerCase() === year + ' ' + month );

	const [ video, setVideo ] = useState( {
		url: archiveItems[ archiveItems.length - 1 ].url,
		title: archiveItems[ archiveItems.length - 1 ].title,
	} );

	useEffect( () => {
		ref.current.scrollIntoView( { behavior: 'smooth', block: 'start' } );
	}, [] );

	const backHandle = () => {
		if ( location.state?.fromLivestream ) {
			navigate( -1 );
		} else {
			navigate( '/' );
		}
	};

	return (
		<>
			<Button
				className="event__back-btn"
				icon={ <ArrowLeftOutlined /> }
				onClick={ backHandle }
				ref={ ref }
			>
				Back
			</Button>
			<h1 className="livestream__title">{ month } Live Streams</h1>
			<LivestreamVideo video={ video } />
			<LivestreamSlider
				archiveItems={ archiveItems }
				video={ video }
				setVideo={ setVideo }
				month={ month }
			/>

			<h2 className="livestream__sub-title">Live Streams List</h2>
			<div className="livestream__list">
				{ archiveItems
					.map( ( item ) => (
						<button className="livestream__link" key={ item.id }
							onMouseDown={ () => setVideo( { ...video, url: item.url, title: item.title } ) }
						>
							{ item.title + ' - ' + moment( item.publishDatetimeGMT ).format( 'DD MMM YYYY LT' ) }
						</button>
					) )
				}
			</div>
		</>
	);
}
