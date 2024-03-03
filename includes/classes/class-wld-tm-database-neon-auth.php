<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

final class WLD_TM_Database_Neon_Auth {
	protected static string $name   = 'tm_neon_accounts_auth';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		account_id int(11) NOT NULL,
		token varchar(1024) NOT NULL,
		date_created datetime NOT NULL,
		PRIMARY KEY  (id),
		KEY account_id (account_id),
		KEY token (token)
	';

	public static function create() : array {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$name   = self::get_table_name();
		$scheme = self::$scheme;
		$sql    = "
			CREATE TABLE $name ($scheme)
			DEFAULT CHARACTER SET $wpdb->charset COLLATE $wpdb->collate;
		";

		return dbDelta( $sql );
	}

	public static function logout( string $token ) : void {
		$table = self::get_table_name();

		global $wpdb;
		$wpdb->query(
			$wpdb->prepare(
				"DELETE FROM $table WHERE account_id = %s",
				$token
			),
		);
	}

	public static function get_account_id_by_authorization( array $headers = array() ) {
		$table = self::get_table_name();
		if ( empty( $headers['authorization'] ) ) {
			return 0;
		}

		$headers = $headers['authorization'][0];
		$headers = str_replace( 'Basic ', '', $headers );

		global $wpdb;

		$result = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE token = %s",
				$headers
			),
		);

		return $result->account_id ?? 0;
	}

	public static function get_token_from_account( int $account_id ) {
		$table = self::get_table_name();

		global $wpdb;

		$result = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE account_id = %d",
				$account_id
			),
		);

		return $result->token ?? false;
	}

	public static function auth_complete( int $account_id, string $account_hash ) : array {
		if ( false !== self::get_token_from_account( $account_id ) ) {
			$account             = WLD_TM_Neon_API_Accounts::get_account( $account_id, true );
			$orders              = WLD_TM_Neon_API_Orders::get_orders( $account_id ) ?? array();
			$recurring_donations = WLD_TM_Neon_API_Recurring_Donations::get_recurring_donations( $account_id ) ?? array();

			if ( is_wp_error( $recurring_donations ) ) {
				$recurring_donations = 'error';
			} else {
				$recurring_donations = $recurring_donations['recurringDonations'] ?? array();
			}

			if ( is_wp_error( $account ) ) {
				$account = array(
					'auth'    => 'error',
					'account' => 'error',
				);
			} else {
				$account = array(
					'auth'    => $account['auth'],
					'account' => $account['account'],
				);
			}


			if ( is_wp_error( $orders ) ) {
				$orders = 'error';
			} else {
				$orders = $orders ?? array();
			}

			return array(
				'account'             => $account['account'],
				'auth'                => $account['auth'],
				'orders'              => $orders,
				'recurring_donations' => $recurring_donations,
			);
		}

		WLD_TM_Neon_Sync_Model::update_sync_data( 'account', $account_id );
		WLD_TM_Neon_Sync_Model::update_sync_data( 'orders', $account_id );
		WLD_TM_Neon_Sync_Model::update_sync_data( 'recurring_donations', $account_id );

		global $wpdb;
		$wpdb->insert(
			self::get_table_name(),
			array(
				'account_id'   => $account_id,
				'token'        => $account_hash,
				'date_created' => gmdate( 'Y-m-d H:i:s' ),
			)
		);

		$account             = WLD_TM_Neon_API_Accounts::get_account( $account_id, true );
		$orders              = WLD_TM_Neon_API_Orders::get_orders( $account_id ) ?? array();
		$recurring_donations = WLD_TM_Neon_API_Recurring_Donations::get_recurring_donations( $account_id )['recurringDonations'] ?? array();

		return array(
			'account'             => $account['account'],
			'auth'                => $account['auth'],
			'orders'              => $orders,
			'recurring_donations' => $recurring_donations,
		);
	}

	public static function get_count_auth() : int {
		global $wpdb;
		$table = self::get_table_name();
		$query = $wpdb->query(
			$wpdb->prepare(
				"SHOW TABLES LIKE %s",
				$table
			),
		);

		if ( empty( $query ) ) {
			return 0;
		}

		return count(
			$wpdb->get_results( "SELECT * FROM $table" )
		);
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}
}
