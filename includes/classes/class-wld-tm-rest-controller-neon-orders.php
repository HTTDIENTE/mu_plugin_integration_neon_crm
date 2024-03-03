<?php

final class WLD_TM_REST_Controller_Neon_Orders extends WLD_TM_REST_Controller_Neon {
	protected static string $base   = 'orders';
	protected array         $routes = array(
		array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'create_order' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'orderDate' => array(
						'type'     => 'string',
						'format'   => 'date-time',
						'required' => true,
					),
					'shipping'  => array(
						'type'     => 'array',
						'required' => true,
					),
					'payments'  => array(
						'type'     => 'array',
						'required' => true,
					),
				),
			),
		),
		'shipping-methods' => array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'shipping_methods' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'countryId' => array(
						'type'     => 'string',
						'required' => true,
					),
					'products'  => array(
						'type'     => 'array',
						'required' => true,
					),
					'zipCode'   => array(
						'type'     => 'string',
						'required' => true,
					),
				),
			),
		),
		'calculate'        => array(
			array(
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => array( self::class, 'orders_calculate' ),
				'permission_callback' => array( 'WLD_TM_REST_Controller', 'check_authentication' ),
				'args'                => array(
					'products' => array(
						'type'     => 'array',
						'required' => true,
					),
					'shipping' => array(
						'type'     => 'array',
						'required' => true,
					),
				),
			),
		),
	);

	public static function orders_calculate( WP_REST_Request $request ) {
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );
		return WLD_TM_Neon_API_Orders::orders_calculate( $account_id, $request->get_params() );
	}

	public static function shipping_methods( WP_REST_Request $request ) {
		return WLD_TM_Neon_API_Orders::get_shipping_methods( $request->get_params() );
	}

	public static function create_order( WP_REST_Request $request ) {
		$account_id = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );
		$order_data = $request->get_params();
		$result     = WLD_TM_Neon_API_Orders::create_order( $account_id, $order_data );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return array(
			'orders' => WLD_TM_Neon_API_Orders::get_orders( $account_id ),
		);
	}

}
