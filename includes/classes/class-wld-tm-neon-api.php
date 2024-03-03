<?php

class WLD_TM_Neon_API {
	public const URL = 'https://api.neoncrm.com/v2/';

	public static function access_token( string $authorization_code ) {
		return wp_remote_request(
			'https://app.neoncrm.com/np/oauth/token',
			array(
				'method'   => 'POST',
				'timeout'  => 120,
				'blocking' => true,
				'body'     =>
					array(
						'client_id'     => WLD_TM_Settings::get( 'neon_client_id' ),
						'client_secret' => WLD_TM_Settings::get( 'neon_client_secret' ),
						'grant_type'    => 'authorization_code',
						'redirect_uri'  => home_url(),
						'code'          => $authorization_code,
					),
				'headers'  => array(
					'content-type' => 'application/x-www-form-urlencoded',
				),
			)
		);
	}

	public static function request( string $endpoint, array $params = array(), string $method = 'GET' ) {
		// We deliberately use base64_encode here to create the authorization key.
		// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$authorization = base64_encode(
			WLD_TM_Settings::get( 'neon_organization_id' ) . ':' . WLD_TM_Settings::get( 'neon_api_key' )
		);

		$error       = new WP_Error();
		$error_array = array();
		$is_get      = 'GET' === $method;
		$url         = self::URL . $endpoint;
		$pagination  = array();
		$page_size   = $params['pagination']['pageSize'] ?? 0;

		if ( isset( $params['_locale'] ) ) {
			unset( $params['_locale'] );
		}

		if ( isset( $params['pagination'] ) ) {
			if ( isset( $params['pagination']['pageSize'] ) && 0 === $params['pagination']['pageSize'] ) {
				unset( $params['pagination']['pageSize'] );
			}

			$pagination = array_merge(
				array(
					'pageSize'    => 200,
					'currentPage' => 0,
				),
				is_array( $params['pagination'] ) ? $params['pagination'] : array()
			);

			if ( $is_get ) {
				unset( $params['pagination'] );
				$url = add_query_arg( $pagination, $url );
			} else {
				$params['pagination'] = $pagination;
			}
		}

		if ( $is_get ) {
			$url = add_query_arg( $params, $url );
		}

		$response = wp_remote_request(
			$url,
			array(
				'method'   => $method,
				'timeout'  => 120,
				'blocking' => true,
				'body'     => $is_get ? null : wp_json_encode( $params ),
				'headers'  => array(
					'Authorization' => 'Basic ' . $authorization,
					'content-type'  => $is_get ? 'text/plain' : 'application/json',
				),
			)
		);

		if ( is_wp_error( $response ) ) {
			$error = $response;
		} else {
			$code        = wp_remote_retrieve_response_code( $response );
			$body        = wp_remote_retrieve_body( $response );
			$success     = $code >= 200 && $code < 300;
			$valid_codes = array( 200, 201, 204, 222, 400, 401, 403, 404, 429 );

			if ( ! in_array( $code, $valid_codes, true ) ) {
				$message = wp_remote_retrieve_response_message( $response );
				$error->add(
					'invalid_response_code',
					'Invalid Response Code: ' . $code . ' - ' . $message
				);
			} else {
				if ( empty( $body ) ) {
					if ( $success ) {
						return array();
					}

					if ( 404 === $code ) {
						return new WP_Error( 'not_found', 'Not found' );
					}
				}

				/** @noinspection JsonEncodingApiUsageInspection */
				$data = json_decode( $body, true );

				if ( JSON_ERROR_NONE === json_last_error() ) {
					if ( $success ) {
						if ( ( isset( $data['status'] ) && 'Failed' === $data['status'] ) || ( isset( $data['paymentResponse']['status'] ) && 'Failed' === $data['paymentResponse']['status'] ) ) {
							$error->add(
								'neon_error',
								'An error has occurred',
								array(
									'status' => 500,
									'errors' => array(
										'code'    => 'payment_failed',
										'message' => $data['paymentResponse']['statusMessage'],
									),
								)
							);

							return $error;
						}
						if ( isset( $data['pagination'] ) && ! empty( $data['pagination']['totalPages'] ) ) {
							if ( empty( $pagination ) ) {
								$pagination = array(
									'currentPage' => 0,
								);
							}

							$pagination['pageSize'] = $page_size;
							$pagination['currentPage'] ++;

							if ( $pagination['currentPage'] < $data['pagination']['totalPages'] ) {
								$params['pagination'] = $pagination;
								$next                 = self::request( $endpoint, $params, $method );

								if ( is_wp_error( $next ) ) {
									return $next;
								}

								if ( isset( $data['searchResults'] ) ) {
									$data['searchResults'] = array_merge(
										$data['searchResults'],
										$next['searchResults']
									);
								} elseif ( isset( $data['products'] ) ) {
									$data['products'] = array_merge(
										$data['products'],
										$next['products']
									);
								}
							}

							unset( $data['pagination'] );
						}

						return $data;
					}

					foreach ( $data as $item ) {
						$error_array[] = array(
							'code'    => $item['code'],
							'message' => $item['message'],
						);
					}
					$error->add(
						'neon_error',
						'An error has occurred',
						array(
							'status' => 500,
							'errors' => $error_array,
						),
					);
				} else {
					$error->add(
						'neon_error',
						'An error has occurred',
						array(
							'status' => 500,
							'errors' => array(
								'code'    => 'invalid_response_body',
								'message' => 'Invalid Response Body: ' . json_last_error_msg(),
							),
						),
					);
				}
			}
		}

		return $error;
	}
}
