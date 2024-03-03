import { useGaPageView } from '../../global/hooks/use-ga-page-view';

export function LivestreamNotFound() {
	useGaPageView();

	return <div>Livestreams not found</div>;
}
