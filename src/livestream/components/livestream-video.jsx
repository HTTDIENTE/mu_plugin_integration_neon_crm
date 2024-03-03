export function LivestreamVideo( { video } ) {
	return (
		<div className="livestream__video" style={ { aspectRatio: '16/9' } }>
			<iframe
				id="frame"
				src={ video.url }
				title={ video.title }
				width="100%"
				height="100%"
				allowFullScreen=""
			/>
		</div>
	);
}
