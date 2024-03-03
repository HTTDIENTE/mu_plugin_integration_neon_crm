<?php

final class WLD_TM_REST_Controller_Neon_Store extends WLD_TM_REST_Controller_Neon {
	/*protected array $routes = array(
		'logout' => array(
			array(
				'methods'             => WP_REST_Server::DELETABLE,
				'callback'            => array( self::class, 'logout' ),
			),
		),
	);*/

	public static function get_products() {
		return WLD_TM_Neon_API::request(
			'/store/products',
		);
	}

}
