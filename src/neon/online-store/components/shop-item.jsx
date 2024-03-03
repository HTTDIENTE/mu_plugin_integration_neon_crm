import { Card } from 'antd';
import { priceFormat } from '../../../global/scripts/data-format/price-format';
const { Meta } = Card;

export default function ShopItem( { product } ) {
	let alt = ' ';
	let src = 'https://www.feed-image-editor.com/sites/default/files/perm/wysiwyg/image_not_available.png';
	if ( product.images.length ) {
		alt = product.images[ 0 ].alt;
		src = product.images[ 0 ].url;
	}

	const CardTitle = () => {
		return (
			<>
				<div className="shop__item-title">{ product.title }</div>
				<div className="shop__item-price">
					{ priceFormat( product.price ) }
				</div>
			</>
		);
	};

	return (
		<Card
			className="shop__item"
			title={ product.code ? `code: ${ product.code }` : ' ' }
			hoverable
			cover={
				<img alt={ alt } src={ src } width="423" height="423" />
			}
		>
			<Meta
				title={ <CardTitle /> }
				description={ product.description.replaceAll( /<[^>]*>/g, '' ) }
			/>
		</Card>
	);
}
