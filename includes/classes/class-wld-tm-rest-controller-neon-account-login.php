<?php

final class WLD_TM_REST_Controller_Neon_Account_Login extends WLD_TM_REST_Controller_Neon {
	protected static string $base = 'auth';

	protected array $routes = array(
		array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'login' ),
				'args'     => array(
					'authorizationCode' => array(
						'description' => 'Is the authorization code from the redirect URL parameter',
						'type'        => 'string',
						'required'    => true,
					),
				),
			),
		),
		array(
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( self::class, 'logout' ),
				'permission_callback' => array( 'WLD_TM_Rest_Controller', 'check_authentication' ),
			),
		),
	);

	public static function logout( WP_REST_Request $request ) : bool {
		$token = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );
		if ( ! empty( $token ) ) {
			WLD_TM_Database_Neon_Auth::logout( $token );
		}
		return true;
	}

	public static function login( WP_REST_Request $request ) {
		$authorization_code = $request->get_param( 'authorizationCode' );
		$response           = WLD_TM_Neon_API::access_token( $authorization_code );

		/** @noinspection JsonEncodingApiUsageInspection */
		$response = json_decode( $response['body'] );

		if ( ! isset( $response->access_token ) ) {
			return new WP_Error( 'Neon API: Error, please try later' );
		}

		return self::auth_complete( $response->access_token );
	}

	public static function auth_complete( int $account_id ) : array {
		// We deliberately use base64_encode here to create the authorization key.
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$account_hash = base64_encode( $account_id . ':' . time() );

		return WLD_TM_Database_Neon_Auth::auth_complete( $account_id, $account_hash );
	}

}
