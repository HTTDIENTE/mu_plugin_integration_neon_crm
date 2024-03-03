<?php

final class WLD_TM_REST {
	public static function init() : void {
		add_action(
			'rest_api_init',
			array( self::class, 'register' )
		);
		add_filter(
			'rest_request_after_callbacks',
			array( self::class, 'response' ),
			10,
			3
		);
	}

	public static function register() : void {
		$neon_account = new WLD_TM_REST_Controller_Neon_Accounts();
		$neon_account->register_routes();

		$account_auth = new WLD_TM_REST_Controller_Neon_Account_Login();
		$account_auth->register_routes();

		$account_register = new WLD_TM_REST_Controller_Neon_Account_Register();
		$account_register->register_routes();

		$webhooks = new WLD_TM_REST_Controller_Neon_Webhooks();
		$webhooks->register_routes();

		$neon_sync = new WLD_TM_REST_Controller_Neon_Sync();
		$neon_sync->register_routes();

		$store = new WLD_TM_REST_Controller_Neon_Store();
		$store->register_routes();

		$orders = new WLD_TM_REST_Controller_Neon_Orders();
		$orders->register_routes();

		$events = new WLD_TM_REST_Controller_Neon_Events();
		$events->register_routes();

		$donations = new WLD_TM_REST_Controller_Neon_Donations();
		$donations->register_routes();

		$audience = new WLD_TM_REST_Controller_Audiences();
		$audience->register_routes();

		WLD_TM_Log::log(
			'info',
			'-------------Registering endpoints rest-api complete------------',
			'rest-api'
		);
	}

	public static function response( $response, array $handler, WP_REST_Request $request ) {
		WLD_TM_Log::log(
			'info',
			'-------------Starting request to endpoint------------',
			'rest-api'
		);
		$controller = $handler['callback'][0] ?? '';
		if ( is_string( $controller ) && str_starts_with( $controller, 'WLD_TM_REST_Controller_' ) ) {
			if ( ! $response instanceof WLD_TM_REST_Error && is_wp_error( $response ) ) {
				$error = new WLD_TM_REST_Error();
				$error->merge_from( $response );

				WLD_TM_Log::write(
					$error,
					'error',
					'rest-api'
				);
				return $error;
			}

			if ( ! $response instanceof WLD_TM_REST_Success ) {
				$response = (array) $response;
				if ( isset( $response['code'] ) ) {
					$code = $response['code'];
					unset( $response['code'] );
				} else {
					/** @var WLD_TM_REST_Controller $controller This string is the class name of the child class. */
					$name     = $controller::get_name();
					$base     = $controller::get_base();
					$method   = strtolower( $request->get_method() );
					$callback = $handler['callback'][1];
					$code     = sprintf(
						'%s_%s%s%s',
						$method,
						$name,
						$name !== $base ? '_' . $base : '',
						$base !== $callback ? '_' . $callback : ''
					);
				}

				if ( isset( $response['message'] ) ) {
					$message = $response['message'];
					unset( $response['message'] );
				} else {
					$message = __( 'Success', 'wld-the-merge' );
				}

				WLD_TM_Log::log(
					'info',
					'-------------Request completed------------',
					'rest-api'
				);

				return new WLD_TM_REST_Success(
					$code,
					$message,
					$response
				);
			}
		}

		return $response;
	}
}
