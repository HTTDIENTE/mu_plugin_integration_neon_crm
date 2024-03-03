import { Button, Image, InputNumber, Row } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from '@wordpress/element';
import {
	delCartItem,
	getCartItems,
	setCartItems,
} from '../../../global/scripts/storage';
import { priceFormat } from '../../../global/scripts/data-format/price-format';

export function CartItem( { product, checkout } ) {
	const [ qty, setQty ] = useState( product.quantity );
	let alt = ' ';
	let src = 'https://www.feed-image-editor.com/sites/default/files/perm/wysiwyg/image_not_available.png';
	if ( product.images.length ) {
		alt = product.images[ 0 ].alt;
		src = product.images[ 0 ].url;
	}

	useEffect( () => {
		setQty( product.quantity );
	}, [ product.quantity ] );

	useEffect( () => {
		setCartItems(
			getCartItems().map( ( item ) => {
				if ( item.id === product.id ) {
					item.quantity = qty;
				}
				return item;
			} )
		);
	}, [ qty ] );

	return (
		<div className="cart__item">
			<div className="cart__image">
				<Image alt={ alt } src={ src } />
			</div>
			<div className="cart__content">
				<p className="cart__code">{ `code: ${ product.code }` }</p>
				<a
					className="cart__title"
					href={ `${ global.neon.pages.onlineStore }product/${ product.id }/` }
				>
					{ product.title }
				</a>
				<p className="cart__price">{ priceFormat( product.price ) }</p>
				{ ! checkout && (
					<>
						<Row>
							<label htmlFor={ `cart-item-${ product.id }-qty` }>
								QTY:
							</label>
							<InputNumber
								id={ `cart-item-${ product.id }-qty` }
								min={ 1 }
								value={ qty }
								onChange={ ( value ) => setQty( value ) }
							/>
						</Row>
						<Button
							icon={ <DeleteOutlined /> }
							type="link"
							onClick={ () => delCartItem( product.id ) }
						/>
					</>
				) }
				{ checkout && (
					<p className="cart__quantity">{ `QTY: ${ product.quantity }` }</p>
				) }
			</div>
		</div>
	);
}
