<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

class WLD_TM_Database_Neon_Products_Categories {
	protected static string $name   = 'tm_product_categories';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		category_id int(11) NOT NULL,
		title varchar(1024) NOT NULL,
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
			"DELETE FROM $table WHERE 1"
		);
	}

	public static function update_categories( array $data ) : void {
		self::clear_table();

		global $wpdb;
		foreach ( $data as $row ) {
			$wpdb->insert(
				self::get_table_name(),
				array(
					'category_id' => $row['id'],
					'title'       => $row['name'],
				),
			);
		}
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}
}
