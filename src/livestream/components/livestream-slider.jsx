import Slider from 'react-slick';
import { LivestreamSlide } from './livestream-slide';
import 'slick-carousel/slick/slick.css';
import { Button } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';

export function LivestreamSlider( { archiveItems, video, setVideo, month } ) {
	const settings = {
		dots: false,
		infinite: true,
		autoplay: true,
		speed: 500,
		slidesToShow: archiveItems.length < 4 ? archiveItems.length : 4,
		slidesToScroll: 1,
		// prevArrow: <Button icon={ <ArrowLeftOutlined /> } />,
		// nextArrow: <Button icon={ <ArrowRightOutlined /> } />,
	};

	return (
		<div className="livestream__slider">
			{ ! month && <h2 className="livestream__sub-title">Videos in the last 30 days</h2> }
			{ month && <h2 className="livestream__sub-title">{ month } videos</h2> }
			<Slider { ...settings } className="livestream__wrapper">
				{ archiveItems.map( ( liveStream, index ) => (
					<LivestreamSlide
						key={ index }
						liveStream={ liveStream }
						video={ video }
						setVideo={ setVideo }
					/>
				) ) }
			</Slider>
		</div>
	);
}
