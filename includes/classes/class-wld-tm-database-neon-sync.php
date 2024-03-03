<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

class WLD_TM_Database_Neon_Sync {
	protected static string $name   = 'tm_neon_sync';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		account_id int(11) NOT NULL,
		type varchar(128) NOT NULL,
		updated_datetime_gmt datetime NOT NULL,
		PRIMARY KEY (id),
		KEY account_id (account_id)
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

	public static function update_sync_data( string $type = '', int $account_id = 0 ) : bool {
		global $wpdb;

		$has_row = self::has_row( $type, $account_id );
		$table   = self::get_table_name();

		if ( empty( $has_row ) ) {
			return WLD_TM_Neon_Sync_Model::add_sync_data( $type, $account_id );
		}

		$wpdb->query(
			$wpdb->prepare(
				"UPDATE $table SET updated_datetime_gmt = %s WHERE type = %s AND $account_id = %d",
				gmdate( 'Y-m-d H:i:s' ),
				$type,
				$account_id,
			),
		);

		return true;
	}

	public static function has_row( string $type, int $account_id ) {
		global $wpdb;

		$table = self::get_table_name();

		return $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE `type` = %s AND `account_id` = %d",
				$type,
				$account_id,
			),
		);
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}
}
