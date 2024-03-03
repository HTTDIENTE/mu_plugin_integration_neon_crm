<?php

final class WLD_TM_REST_Controller_Neon_Account_Register extends WLD_TM_REST_Controller_Neon {
	protected array $routes = array(
		'account' => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'register' ),
				'args'     => array(
					'login'          => array(
						'description' => 'This is an array that is sent to Neon CRM to create an account.',
						'type'        => 'object',
						'required'    => true,
					),
					'primaryContact' => array(
						'description' => 'This is an array that is sent to Neon CRM to create an account.',
						'type'        => 'object',
						'required'    => true,
					),
				),
			),
		),
	);

	public static function register( WP_REST_Request $request ) {
		$account_data   = $request->get_params();
		$account_data   = array(
			'login'          => $account_data['login'],
			'primaryContact' => $account_data['primaryContact'],
		);
		$create_account = WLD_TM_Neon_API_Accounts::create_account( $account_data );

		if ( is_wp_error( $create_account ) ) {
			return $create_account;
		}

		// We deliberately use base64_encode here to create the authorization key.
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$account_hash = base64_encode( $create_account . ':' . time() );

		return WLD_TM_Database_Neon_Auth::auth_complete( $create_account, $account_hash );
	}
}
