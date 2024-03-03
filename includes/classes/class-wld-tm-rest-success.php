<?php

final class WLD_TM_REST_Success extends WP_REST_Response {
	use WLD_TM_Data_Clean;

	public function __construct( string $code, string $message, $data = array() ) {
		if ( empty( $data['status'] ) ) {
			$data['status'] = 200;
		}

		$code       = wp_strip_all_tags( $code );
		$message    = wp_strip_all_tags( $message );
		$array_data = array();

		if ( $data ) {
			$array_data = (array) $data;
			self::clean( $array_data );
		}

		parent::__construct(
			array(
				'code'    => $code,
				'message' => $message,
				'data'    => $array_data,
			)
		);
	}
}
