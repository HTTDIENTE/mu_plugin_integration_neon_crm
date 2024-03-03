<?php

final class WLD_TM_Neon_API_Products extends WLD_TM_Neon_API {
	public static function get_products() : array {
		$result = WLD_TM_Neon_API::request(
			'store/products',
			array(
				'status' => 'ACTIVE',
			)
		);

		if ( is_wp_error( $result ) ) {
			return array();
		}

		return $result;
	}

	public static function get_categories() : array {
		$result = WLD_TM_Neon_API::request(
			'store/categories',
		);

		if ( is_wp_error( $result ) ) {
			return array();
		}

		return $result;
	}
}
