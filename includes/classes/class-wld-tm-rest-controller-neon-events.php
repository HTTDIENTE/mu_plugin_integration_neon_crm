<?php

final class WLD_TM_REST_Controller_Neon_Events extends WLD_TM_REST_Controller_Neon {
	protected array $routes = array(
		'event-registrations' => array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'registration' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'eventId'              => array(
						'description' => 'Event ID, you need to find out which event we are registering.',
						'type'        => array( 'string', 'integer' ),
						'required'    => true,
					),
					'registrationDateTime' => array(
						'description' => 'Date and time of event registration',
						'type'        => 'string',
						'format'      => 'date-time',
						'required'    => true,
					),
					'payments'             => array(
						'description' => 'An array containing the payment method and billing addresses',
						'type'        => 'array',
						'required'    => true,
					),
				),
			),
		),
	);
	public static function registration( WP_REST_Request $request ) {
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );
		$data       = $request->get_params();

		return WLD_TM_Neon_API_Event_Registration::registration( $account_id, $data );
	}

}
