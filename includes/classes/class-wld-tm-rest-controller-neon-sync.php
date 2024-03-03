<?php

final class WLD_TM_REST_Controller_Neon_Sync extends WLD_TM_REST_Controller_Neon {
	protected static string $base = 'sync';

	protected array $routes = array(
		array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'sync' ),
				'args'     => array(
					'account'    => array(
						'type'     => 'string',
						'format'   => 'date-time',
						'required' => true,
					),
					'orders'     => array(
						'type'     => 'string',
						'format'   => 'date-time',
						'required' => true,
					),
					'products'   => array(
						'type'     => 'string',
						'format'   => 'date-time',
						'required' => true,
					),
					'events'     => array(
						'type'     => 'string',
						'format'   => 'date-time',
						'required' => true,
					),
					'livestream' => array(
						'type'     => 'string',
						'format'   => 'date-time',
						'required' => true,
					),
				),
			),
		),
	);

	public static function sync( WP_REST_Request $request ) : array|WP_Error {
		$account_id      = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );
		$products_date   = date( 'Y-m-d H:i', strtotime( $request->get_param( 'products' ) ?? '' ) ) ?? '';
		$livestream_date = date( 'Y-m-d H:i', strtotime( $request->get_param( 'livestream' ) ?? '' ) ) ?? '';
		$events_date     = date( 'Y-m-d H:i', strtotime( $request->get_param( 'events' ) ?? '' ) ) ?? '';

		if ( empty( $account_id ) ) {
			return WLD_TM_Neon_Sync_Model::get_sync(
				$account_id,
				array(
					'products'   => strtotime( $products_date ),
					'livestream' => strtotime( $livestream_date ),
					'events'     => strtotime( $events_date ),
				)
			);
		}

		$account_date        = date( 'Y-m-d H:i', strtotime( $request->get_param( 'account' ) ?? '' ) ) ?? '';
		$orders_date         = date( 'Y-m-d H:i', strtotime( $request->get_param( 'orders' ) ?? '' ) ) ?? '';
		$recurring_donations = date( 'Y-m-d H:i', strtotime( $request->get_param( 'recurringDonations' ) ?? '' ) ) ?? '';

		return WLD_TM_Neon_Sync_Model::get_sync(
			$account_id,
			array(
				'account'             => strtotime( $account_date ),
				'orders'              => strtotime( $orders_date ),
				'products'            => strtotime( $products_date ),
				'livestream'          => strtotime( $livestream_date ),
				'events'              => strtotime( $events_date ),
				'recurring_donations' => strtotime( $recurring_donations ),
			)
		);
	}
}
