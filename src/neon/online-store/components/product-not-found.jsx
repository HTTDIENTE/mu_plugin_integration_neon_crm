import { useGaPageView } from '../../../global/hooks/use-ga-page-view';

export function ProductNotFound() {
	useGaPageView();

	return <div>Product not found</div>;
}
