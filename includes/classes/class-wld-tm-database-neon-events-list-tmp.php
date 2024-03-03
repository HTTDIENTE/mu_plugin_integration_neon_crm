<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

final class WLD_TM_Database_Neon_Events_List_TMP extends WLD_TM_Database_Neon_Events {
	protected static string $name   = 'tm_events_list_tmp';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		neon_event_id int(11) NOT NULL,
		PRIMARY KEY  (id)
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

	public static function clear_table() : void {
		$table = self::get_table_name();

		global $wpdb;
		$wpdb->query(
			"DROP TABLE $table"
		);
	}

	public static function update_events_list_tmp() : void {
		$events      = WLD_TM_Neon_API_Events::get_events();
		$table       = self::get_table_name();
		$events_data = array();

		# Dropping table if she`s exist
		if ( self::has_table( $table ) ) {
			self::clear_table();
		}

		# Create table in database if she's not exist
		self::create();

		global $wpdb;

		foreach ( $events['searchResults'] as $row ) {
			$events_data[] = $wpdb->prepare(
				'(%d)',
				$row['Event ID'],

			);
		}
		$wpdb->query(
			"
				INSERT INTO $table (
				`neon_event_id`
				) VALUES " . implode( ',', $events_data )
		);
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}

	private static function has_table( string $table ) : bool {
		global $wpdb;

		return $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) === $table;
	}
}
