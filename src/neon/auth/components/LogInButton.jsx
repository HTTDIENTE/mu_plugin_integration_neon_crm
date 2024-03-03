export default function LogInButton() {
	const url = new URL(
		`https://${ global.neon.organizationId }.app.neoncrm.com/np/oauth/auth`
	);

	const redirectUri = new URL( window.location );
	redirectUri.searchParams.delete( 'logout' );

	url.searchParams.set( 'response_type', 'code' );
	url.searchParams.set( 'client_id', global.neon.clientId );
	url.searchParams.set( 'redirect_uri', redirectUri.toString() );

	if ( '127.0.0.1' === window.location.hostname ) {
		url.searchParams.set(
			'redirect_uri',
			redirectUri.toString().replace( /^https?:\/\//, '' )
		);
	} else {
		url.searchParams.set( 'redirect_uri', redirectUri.toString() );
	}

	return (
		<a href={ url.toString() } className="btn">
			Login
		</a>
	);
}
