import { useGaPageView } from '../../../global/hooks/use-ga-page-view';

export function CategoryNotFound() {
	useGaPageView();

	return <div>Category not found</div>;
}
