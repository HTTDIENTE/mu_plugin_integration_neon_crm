<?php

final class WLD_TM_REST_Controller_Neon_Donations extends WLD_TM_REST_Controller_Neon {
	protected array $routes = array(
		'account/recurring-donations/payment' => array(
			array(
				'methods'             => 'PATCH',
				'callback'            => array( self::class, 'update_recurring_donation_payment' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					array(
						'description' => 'Data array for updating the Neon CRM recurring donations (Payment information)',
						'type'        => 'array',
						'required'    => true,
					),
				),
			),
		),
		'account/recurring-donations'         => array(
			array(
				'methods'             => 'PATCH',
				'callback'            => array( self::class, 'update_recurring_donation' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					array(
						'description' => 'Data array for updating the Neon CRM recurring donations',
						'type'        => 'array',
						'required'    => true,
					),
				),
			),
		),

		'account/recurring-donations/(?P<recurring_delete_id>\d+)' => array(
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( self::class, 'delete_recurring_donations' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					array(
						'description' => 'Data array for updating the Neon CRM recurring donations',
						'type'        => 'array',
						'required'    => true,
					),
				),
			),
		),
		'donations/one-time'                                       => array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'create_donation' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'date'     => array(
						'description' => 'Date and time of donation Neon CRM',
						'type'        => 'string',
						'format'      => 'date-time',
						'required'    => true,
					),
					'amount'   => array(
						'description' => 'Donation amount',
						'type'        => 'integer',
						'required'    => true,
					),
					'payments' => array(
						'description' => 'Donation Data Array',
						'type'        => 'array',
						'required'    => true
					),
				),
			),
		),
		'donations/recurring'                                      => array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'create_recurring_donation' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args' => array(
					'recurringPeriod'     => array(
						'description' => 'How many times should the payment be repeated. Example: Weekly, Every 3 month',
						'type'        => 'integer',
						'required'    => true,
					),
					'recurringPeriodType' => array(
						'description' => 'The parameter indicates when we should repeat the payment. Example: week, year',
						'type'        => 'string',
						'required'    => true,
					),
					'amount'              => array(
						'description' => 'Donation amount',
						'type'        => 'integer',
						'required'    => true,
					),
					'nextDate'            => array(
						'description' => 'When should the cycle of regular donations start?',
						'type'        => 'string',
						'format'      => 'date-time',
						'required'    => true,
					),
					'creditCardOnline'    => array(
						'description' => 'Recurring donation data',
						'type'        => 'object',
						'required'    => true,
					),
				),
			),
		),
	);

	public static function create_recurring_donation( WP_REST_Request $request ) {
		$data       = $request->get_params();
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Recurring_Donations::create_donation( $account_id, $data );
	}

	public static function create_donation( WP_REST_Request $request ) {
		$data       = $request->get_params();
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Donations::create_donation( $account_id, $data );
	}

	public static function update_recurring_donation_payment( WP_REST_Request $request ) {
		$recurring_data = $request->get_params();
		$account_id     = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Recurring_Donations::update_recurring_donation_payment( $account_id, $recurring_data );
	}

	public static function update_recurring_donation( WP_REST_Request $request ) {
		$recurring_data = $request->get_params();

		unset( $recurring_data['_locale'] );

		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Recurring_Donations::update_recurring_donation( $account_id, $recurring_data );
	}

	public static function delete_recurring_donations( WP_REST_Request $request ) {
		$recurring_id = $request->get_param( 'recurring_delete_id' );
		$account_id   = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Recurring_Donations::delete_recurring_donation( $account_id, $recurring_id );
	}
}
