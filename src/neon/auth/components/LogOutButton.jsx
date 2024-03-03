export default function LogOutButton() {
	const targetUrl = new URL( window.location );
	targetUrl.searchParams.set( 'logout', '1' );
	targetUrl.searchParams.delete( 'code' );

	const url = new URL(
		`https://${ global.neon.organizationId }.app.neoncrm.com/np/logout.do`
	);

	url.searchParams.set( 'response_type', 'code' );
	url.searchParams.set( 'targetUrl', targetUrl.toString() );

	return (
		<a id="logout-btn" href={ url.toString() } className="btn">
			LogOut
		</a>
	);
}
