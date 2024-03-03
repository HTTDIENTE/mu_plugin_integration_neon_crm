<?php

final class WLD_TM_REST_Controller_Neon_Webhooks extends WLD_TM_REST_Controller_Neon {
	protected array $routes = array(
		'updateAccount'           => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'deleteAccount'           => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'createDonation'          => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'updateDonation'          => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'deleteDonation'          => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'createEventRegistration' => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'updateEventRegistration' => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'deleteEventRegistration' => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'createOrder'             => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'updateOrder'             => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
		'testwebhook'             => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'testwebhook' ),
			),
		),
		'createMergedAccount'     => array(
			array(
				'methods'  => WP_REST_Server::CREATABLE,
				'callback' => array( self::class, 'update' ),
			),
		),
	);

	public static function update( WP_REST_Request $request ) {
		$request    = $request->get_params();
		$request    = json_decode( $request['payload'] );
		switch ( $request->eventTrigger ) {
			case 'editAccount':
				$account_id = $request->data->individualAccount->accountId;
				WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account_id );
				break;
			case 'deleteAccount':
				$account_id = $request->data->account->accountId;
				WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account_id );
				break;
			case 'createDonation':
			case 'updateDonation':
				$account_id = $request->data->donation->accountId;
				WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account_id );
				break;
			case 'createOrder':
			case 'updateOrder':
				$account_id = $request->data->accountId;
				WLD_TM_Database_Neon_Sync::update_sync_data( 'orders', $account_id );
				WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account_id );
				break;
			case 'createEventRegistration':
			case 'updateEventRegistration':
				$account_id = $request->data->tickets->attendees;
				WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account_id );
				break;
		}
	}
}
