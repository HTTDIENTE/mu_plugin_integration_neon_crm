import { Image, InputNumber, Row } from 'antd';
import { useEffect, useRef, useState } from '@wordpress/element';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
	getCartItems,
	getProduct,
	setCartItem,
	setCartItems,
} from '../../../global/scripts/storage';
import { useGaPageView } from '../../../global/hooks/use-ga-page-view';
import { priceFormat } from '../../../global/scripts/data-format/price-format';

export default function Product() {
	useGaPageView();
	const ref = useRef();

	useEffect( () => {
		ref.current.scrollIntoView( { behavior: 'smooth', block: 'start' } );
	}, [] );

	// I chose not to use useLoaderData since it returns a less defined value.
	// But I like it better because it doesn't need to pass a productId parameter defined elsewhere.
	// const product = useLoaderData();
	const product = getProduct( useParams().productId );
	const navigate = useNavigate();
	const location = useLocation();
	const [ qty, setQty ] = useState( 1 );

	const addToCart = () => {
		const cartItems = getCartItems();

		if ( cartItems.some( ( item ) => item.id === product.id ) ) {
			setCartItems(
				cartItems.map( ( item ) => {
					if ( item.id === product.id ) {
						item.quantity += qty;
					}
					return item;
				} )
			);
		} else {
			setCartItem( { ...product, quantity: qty } );
		}
	};

	const backHandle = () => {
		if ( location.state?.fromShop ) {
			navigate( -1 );
		} else {
			navigate( '/' );
		}
	};

	return (
		<div className="product" id={ `product-${ product.id }` } ref={ ref }>
			<div className="product__images">
				<Image.PreviewGroup>
					{ product.images.map( ( image, index ) => (
						<Image
							key={ index }
							src={ image.url }
							alt={ image.alt }
						/>
					) ) }
					{ ! product.images.length && <Image
						src="https://www.feed-image-editor.com/sites/default/files/perm/wysiwyg/image_not_available.png"
						alt=" "
					/> }
				</Image.PreviewGroup>
			</div>
			<div className="product__content">
				{ product.code && <p className="product__code">{ `Product code: ${ product.code }` }</p> }
				<h1 className="product__title">{ product.title }</h1>
				<p className="product__description">
					{ product.description.replaceAll( /<[^>]*>/g, '' ) }
				</p>
				<p className="product__price">
					{ priceFormat( product.price ) }
				</p>
				<Row>
					<label htmlFor={ `product-${ product.id }-qty` }>
						QTY:
					</label>
					<InputNumber
						id={ `product-${ product.id }-qty` }
						min={ 1 }
						value={ qty }
						onChange={ ( value ) => setQty( value ) }
					/>
				</Row>
				<button className="btn" type="button" onClick={ addToCart }>
					Add to Cart
				</button>
				<button className="product__back-btn" onClick={ backHandle }>
					Back to shop
				</button>
			</div>
		</div>
	);
}
