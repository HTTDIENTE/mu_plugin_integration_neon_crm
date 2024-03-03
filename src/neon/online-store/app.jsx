import { getProduct } from '../../global/scripts/storage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProductNotFound } from './components/product-not-found';
import { CategoryNotFound } from './components/category-not-found';
import { AppWrapper } from '../../global/components/app-wrapper';
import { lazy, Suspense } from '@wordpress/element';

const ShopLazy = lazy( () =>
	import( /* webpackChunkName: "shop" */ './components/shop' )
);

const ProductLazy = lazy( () =>
	import( /* webpackChunkName: "product" */ './components/product' )
);

const router = createBrowserRouter(
	[
		{
			path: '/*',
			element: (
				<Suspense>
					<ShopLazy />
				</Suspense>
			),
		},
		{
			path: '/product/:productId/',
			element: <ProductLazy />,
			errorElement: <ProductNotFound />,
			loader: ( { params } ) => {
				return getProduct( params.productId );
			},
		},
		{
			path: '/category/:categorySlug/',
			element: (
				<Suspense>
					<ShopLazy />
				</Suspense>
			),
			errorElement: <CategoryNotFound />,
		},
	],
	{
		basename: global.neon.pages.onlineStore,
	}
);

export default function App() {
	return (
		<AppWrapper>
			<RouterProvider router={ router } />
		</AppWrapper>
	);
}
