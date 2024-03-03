<?php

use Vimeo\Vimeo;

class WLD_TM_Vimeo_API {
	public static function request( string $url, array $data = array(), $method = 'GET' ) {
		$api = new Vimeo(
			WLD_TM_Settings::get( 'vimeo_client_id' ),
			WLD_TM_Settings::get( 'vimeo_client_secret' ),
			WLD_TM_Settings::get( 'vimeo_access_token' )
		);

		$response = $api->request(
			$url,
			$data,
			$method
		);

		$success = $response['status'] >= 200 && $response['status'] < 300;
		if ( ! $success ) {
			$errors = new WP_Error();
			foreach ( $response['body']['invalid_parameters'] as $row ) {
				$errors->add( $row['error_code'], $row['error'] );
			}

			return $errors;
		}

		return $response['body'];
	}
}
