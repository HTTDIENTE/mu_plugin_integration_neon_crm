<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

class WLD_TM_Database_Neon_Products {
	protected static string $name   = 'tm_products';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		product_id int(11) NOT NULL,
		category_id int(11) NOT NULL,
		title varchar(1024) NOT NULL,
		code varchar(1024) NOT NULL,
		description varchar(1024) NOT NULL,
		images varchar(1024) NOT NULL,
		price varchar(1024) NOT NULL,
		PRIMARY KEY  (id)
	';

	public static function init() : void {
		add_action(
			'wld_products_cron',
			array( self::class, 'cron' ),
		);
	}

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

	public static function cron() : void {
		$products            = WLD_TM_Neon_API_Products::get_products();
		$products_categories = WLD_TM_Neon_API_Products::get_categories();

		WLD_TM_Database_Neon_Sync::update_sync_data( 'products' );
		self::update_products( $products );
		WLD_TM_Database_Neon_Products_Categories::update_categories( $products_categories );
	}

	public static function clear_table() : void {
		$table = self::get_table_name();

		global $wpdb;
		$wpdb->query(
			"DELETE FROM $table WHERE 1"
		);
	}

	public static function update_products( $data ) : void {
		self::clear_table();

		global $wpdb;
		foreach ( $data['products'] as $row ) {
			$images = array();

			if ( ! empty( $row['images'] ) ) {
				foreach ( $row['images'] as $image ) {
					$images[] = array(
						'url' => $image['url'],
						'alt' => $image['label'],
					);
				}
			}
			$wpdb->insert(
				self::get_table_name(),
				array(
					'product_id'  => $row['id'] ?? '',
					'category_id' => isset( $row['category']['id'] ) ? $row['category']['id'] : 0,
					'title'       => $row['name'] ?? '',
					'code'        => $row['code'] ?? '',
					'description' => $row['description'] ?? '-',
					'price'       => $row['unitPrice'] ?? 0.0,
					'images'      => json_encode( $images ) ?? '',
				),
			);
		}
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}
}
