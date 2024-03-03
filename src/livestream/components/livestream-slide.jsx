import moment from 'moment/moment';

export function LivestreamSlide( { liveStream, setVideo, video } ) {
	const date = moment( liveStream.publishDatetimeGMT ).format(
		'DD MMM, YYYY LT'
	);
	return (
		<button className="livestream__slide"
			onMouseDown={ () => setVideo( { ...video, url: liveStream.url, title: liveStream.title } ) }
		>
			<img className="livestream__image" src={ liveStream.thumbnailUrl } alt=" " />
			<h3 className="livestream__slide-title">{ liveStream.title }</h3>
			<h4 className="livestream__date">{ date }</h4>
		</button>
	);
}
