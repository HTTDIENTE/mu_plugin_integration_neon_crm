<?php

final class WLD_TM_REST_Controller_Neon_Accounts extends WLD_TM_REST_Controller_Neon {
	protected static string $base = 'account';

	protected array $routes = array(
		array(
			array(
				'callback'            => array( self::class, 'update_account' ),
				'methods'             => 'PATCH',
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'primaryContact' => array(
						array(
							'description' => 'Array of user data to be updated in Neon CRM',
							'type'        => 'array',
							'required'    => true,
						),
					),
					'login'          => array(
						array(
							'description' => 'Array of user data to be updated in Neon CRM',
							'type'        => 'array',
							'required'    => true,
						),
					),
				),
			),
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( self::class, 'get_account' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
			),
		),
		'orders'   => array(
			array(
				'methods'             => WP_REST_Server::READABLE,
				'callback'            => array( self::class, 'get_account_orders' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
			),
		),
		'password' => array(
			array(
				'methods'             => 'PATCH',
				'callback'            => array( self::class, 'update_account_password' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'username' => array(
						'description' => 'Neon CRM user login',
						'type'        => 'string',
						'required'    => true,
					),
					'password' => array(
						'description' => 'Neon CRM user password',
						'type'        => 'string',
						'required'    => true,
					),
					'confirm-password' => array(
						'description' => 'Neon CRM user confirm password',
						'type'        => 'string',
						'required'    => true,
					),
				),
			),
		),
		'check/username' => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'username_exist' ),
				'args' => array(
					'username' => array(
						'description' => 'Neon CRM user login',
						'type'        => 'string',
						'required'    => true,
					),
				),
			),
		),
		'check/email' => array(
			array(
				'methods' => WP_REST_Server::CREATABLE,
				'callback'=> array( self::class, 'email_exist' ),
				'args' => array(
					'email' => array(
						'description' => 'Neon CRM user email',
						'type'        => 'string',
						'required'    => true,
					),
				),
			),
		),
	);

	public static function username_exist( WP_REST_Request $request ) {
		$username = $request->get_param( 'username' );

		return WLD_TM_Neon_API_Accounts::username_exist( $username );
	}

	public static function email_exist( WP_REST_Request $request ) {
		$email = $request->get_param( 'email' );

		return WLD_TM_Neon_API_Accounts::email_exist( $email );
	}

	public static function update_account_password( WP_REST_Request $request ) {
		$account_id   = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Accounts_Edit::update_account(
			$account_id,
			array(
				'individualAccount' => array(
					'login' => array(
						'username' => $request->get_param( 'username' ),
						'password' => $request->get_param( 'password' ),
					),
					'primaryContact' => array(
						'contactId' => $request->get_param( 'contactId' ),
						'firstName' => $request->get_param( 'firstName' ),
						'lastName'  => $request->get_param( 'firstName' ),
					),
				),
			),
		);
	}

	public static function update_account( WP_REST_Request $request ) {
		$account_data['individualAccount']['primaryContact'] = $request->get_param( 'primaryContact' );
		$account_data['individualAccount']['login']          = $request->get_param( 'login' );

		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );
		$result     = WLD_TM_Neon_API_Accounts_Edit::update_account( $account_id, $account_data );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		$result['message'] = __( 'Your data is saved!', 'wld-the-merge' );

		return $result;
	}

	public static function get_account( WP_REST_Request $request ) : array {
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Accounts::get_account( $account_id );
	}

	public static function get_account_orders( WP_REST_Request $request ) : array {
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		return WLD_TM_Neon_API_Orders::get_orders( $account_id );
	}
}
