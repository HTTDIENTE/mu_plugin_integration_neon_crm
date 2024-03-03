<?php /** @noinspection SqlResolve, SqlNoDataSourceInspection, JsonEncodingApiUsageInspection */

final class WLD_TM_Neon_Sync_Model extends WLD_TM_Database_Neon_Sync {
	public static function init() {

	}
	public static function get_sync( ?int $account_id, array $data ) : array|WP_Error {
		if ( empty( $account_id ) ) {
			$products_data       = self::get_update_date( 'products' );
			$livestream          = self::get_update_date( 'livestream' );
			$events              = self::get_update_date( 'events' );
			$live                = WLD_TM_Vimeo_API_Videos::get_live();
			$update_account_data = array();

			if ( $products_data > $data['products'] ) {
				$update_account_data['products'] = WLD_TM_Neon_Products_Model::get_products();
			}

			if ( $live ) {
				$update_account_data['livestream'] = $live;
			}

			if ( $livestream > $data['livestream'] ) {
				$update_account_data['livestream'] = WLD_TM_Neon_Livestreams_Model::get_videos();
			}

			if ( $events > $data['events'] ) {
				$update_account_data['events'] = WLD_TM_Neon_Events_Model::get_events();
			}

			return $update_account_data;
		}

		$account_data             = self::get_update_date( 'account', $account_id );
		$orders_data              = self::get_update_date( 'orders', $account_id );
		$products_data            = self::get_update_date( 'products' );
		$livestream_data          = self::get_update_date( 'livestream' );
		$events_data              = self::get_update_date( 'events' );
		$recurring_donations_data = self::get_update_date( 'recurring_donations', $account_id );
		$live                     = WLD_TM_Vimeo_API_Videos::get_live();
		$update_account_data      = array();

		if ( empty( $account_data ) || $account_data > ( $data['account'] ?? '' ) ) {
			$account = WLD_TM_Neon_API_Accounts::get_account( $account_id ) ?? array();
			if ( is_wp_error( $account ) ) {
				$update_account_data['account'] = 'token_invalid';
			} else {
				if ( empty( $account_data ) ) {
					self::update_sync_data( 'account', $account_id );
				}
				$update_account_data['account'] = $account['account'] ?? array();
			}
		}

		if ( empty( $orders_data ) || $orders_data > ( $data['orders'] ?? '' ) ) {
			$orders = WLD_TM_Neon_API_Orders::get_orders( $account_id, true ) ?? array();
			if ( is_wp_error( $orders ) ) {
				$update_account_data['orders'] = 'token_invalid';
			} else {
				if ( empty( $orders_data ) ) {
					self::update_sync_data( 'orders', $account_id );
				}
				$update_account_data['orders'] = $orders ?? array();
			}
		}

		if ( empty( $products_data ) || $products_data > ( $data['products'] ?? '' ) ) {
			$products = WLD_TM_Neon_Products_Model::get_products();
			if ( is_wp_error( $products ) ) {
				$update_account_data['products'] = 'token_invalid';
			} else {
				if ( empty( $products_data ) ) {
					self::update_sync_data( 'products' );
				}
				$update_account_data['products'] = $products;
			}
		}

		if ( $live ) {
			$update_account_data['livestream'] = $live;
		}

		if ( empty( $livestream_data ) || $livestream_data > ( $data['livestream'] ?? '' ) ) {
			$livestream = WLD_TM_Neon_Livestreams_Model::get_videos();
			if ( is_wp_error( $livestream ) ) {
				$update_account_data['livestream'] = 'token_invalid';
			} else {
				if ( empty( $livestream_data ) ) {
					self::update_sync_data( 'livestream' );
				}
				$update_account_data['livestream'] = $livestream;
			}
		}

		if ( empty( $events_data ) || $events_data > ( $data['events'] ?? '' ) ) {
			$events = WLD_TM_Neon_Events_Model::get_events();
			if ( is_wp_error( $events ) ) {
				$update_account_data['events'] = 'token_invalid';
			} else {
				if ( empty( $events_data ) ) {
					self::update_sync_data( 'events' );
				}
				$update_account_data['events'] = $events;
			}
		}

		if ( empty( $recurring_donations_data ) || $recurring_donations_data > ( $data['recurring_donations'] ?? '' ) ) {
			$recurring_donations = WLD_TM_Neon_API_Recurring_Donations::get_recurring_donations( $account_id );
			if ( is_wp_error( $recurring_donations ) ) {
				$update_account_data['recurringDonations'] = 'token_invalid';
			} else {
				if ( empty( $recurring_donations_data ) ) {
					self::update_sync_data( 'recurring_donations', $account_id );
				}
				$update_account_data['recurringDonations'] = $recurring_donations['recurringDonations'] ?? array();
			}
		}

		if ( in_array( 'token_invalid', $update_account_data, true ) ) {
			$error = new WP_Error();
			$error->add(
				'neon_error',
				'An error has occurred',
				array(
					'status' => 500,
					'errors' => array(
						'code'    => 'post_sync_sync_failed',
						'message' => 'not_authorized',
					),
				)
			);

			return $error;
		}

		return $update_account_data;
	}

	public static function get_sync_count( string $type ) : int {
		return match ( $type ) {
			'accounts'    => WLD_TM_Database_Neon_Auth::get_count_auth(),
			'events'      => WLD_TM_Neon_Events_Model::get_count_events(),
			'products'    => WLD_TM_Neon_Products_Model::get_count_products(),
			'livestreams' => WLD_TM_Neon_Livestreams_Model::get_count_livestreams(),
		};
	}

	public static function get_update_date( string $type = '', int $account_id = 0 ) {
		global $wpdb;

		$table = self::get_table_name();

		if ( empty( $account_id ) ) {
			$result = $wpdb->get_row(
				$wpdb->prepare(
					"SELECT * FROM $table WHERE type = %s",
					$type
				),
			);

			$date   = date( 'Y-m-d H:i', strtotime( $result->updated_datetime_gmt ) );

			return strtotime( $date );
		}

		$result = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE account_id = %d AND type = %s",
				$account_id,
				$type,
			),
		);

		$date   = date( 'Y-m-d H:i', strtotime( $result->updated_datetime_gmt ) );

		return strtotime( $date );
	}

	public static function add_sync_data( string $type = '', $account_id = 0 ) : bool {
		global $wpdb;

		$wpdb->insert(
			self::get_table_name(),
			array(
				'account_id'           => $account_id,
				'type'                 => $type,
				'updated_datetime_gmt' => gmdate( 'Y-m-d H:i:s' ),
			),
		);

		return true;
	}
}
