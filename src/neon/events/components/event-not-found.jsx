import { useGaPageView } from '../../../global/hooks/use-ga-page-view';

export function EventNotFound() {
	useGaPageView();

	return <div>Event not found</div>;
}
