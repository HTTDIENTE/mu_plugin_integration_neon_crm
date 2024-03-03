<?php

final class WLD_TM_REST_Controller_Audiences extends WLD_TM_REST_Controller {
	protected static string $base = 'audience';
	protected array $routes       = array(
		array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'audience' ),
				'args'     => array(
					'subscription'      => array(
						'description' => 'Newslatter subscription id for Neon CRM',
						'type'        => 'string',
						'required'    => true,
					),
					'subscriber.email1' => array(
						'description' => 'This email needed for newslatter subscription',
						'type'        => 'string',
						'required'    => true,
					),
				),
			),
		),
	);

	public static function audience( WP_REST_Request $audience ) : void {
		$org_id = WLD_TM_Settings::get( 'neon_organization_id' );

		wp_remote_request(
			'https://' . $org_id . '.app.neoncrm.com/np/clients/' . $org_id . '/submitSubscription.jsp',
			array(
				'method'   => 'POST',
				'timeout'  => 120,
				'blocking' => true,
				'body'     => $audience->get_params(),
			)
		);
	}
}
