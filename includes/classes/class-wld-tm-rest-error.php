<?php

final class WLD_TM_REST_Error extends WP_Error {
	use WLD_TM_Data_Clean;

	/**
	 * Constructor.
	 *
	 * @param string          $code Optional. Error code.
	 * @param string          $message Optional. Error message.
	 * @param Exception|Error $error Optional. The object of the exception or error.
	 * @param array|object    $data Optional. Error data.
	 */
	public function __construct( string $code = '', string $message = '', $error = null, $data = array() ) {
		if ( empty( $data['status'] ) ) {
			$data['status'] = 500;
		}

		if ( WP_DEBUG ) {
			// We use the debugging feature only if debugging is enabled.
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_wp_debug_backtrace_summary
			$data['_backtrace'] = wp_debug_backtrace_summary( self::class, 0, false );
			$data['_error']     = $error;
		}

		parent::__construct( $code, $message, $data );
	}

	public function add( $code, $message, $data = '' ) : void {
		$code       = wp_strip_all_tags( $code );
		$message    = wp_strip_all_tags( $message );
		$array_data = array();

		if ( $data ) {
			$array_data = (array) $data;
			self::clean( $array_data );
		}

		parent::add( $code, $message, $array_data );

		// TODO: Logging
		// Log::error( $code, $message, $data, $error );
	}
}
