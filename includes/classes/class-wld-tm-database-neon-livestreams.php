<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

class WLD_TM_Database_Neon_Livestreams {
	protected static string $name   = 'tm_livestream_videos';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		event_id int(11) NOT NULL,
		title varchar(1024) NOT NULL,
		url varchar(1024) NOT NULL,
		thumbnail_url varchar(1024) NOT NULL,
		publish_datetime_gmt datetime NOT NULL,
		PRIMARY KEY  (id)
	';

	public static function init() : void {
		add_action(
			'wld_vimeo_cron',
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
		$videos = WLD_TM_Vimeo_API_Videos::get_videos();

		WLD_TM_Database_Neon_Sync::update_sync_data( 'livestream' );
		self::update_videos( $videos );
	}

	public static function clear_table() : void {
		$table = self::get_table_name();

		global $wpdb;
		$wpdb->query(
			"DELETE FROM $table WHERE 1"
		);
	}

	public static function update_videos( $data ) : void {
		self::clear_table();

		global $wpdb;
		foreach ( $data['data'] as $row ) {
			$archived = $row['embed']['badges']['live']['archived'];

			if ( ! $archived ) {
				continue;
			}

			$wpdb->insert(
				self::get_table_name(),
				array(
					'event_id'             => str_replace( '/videos/', '', $row['uri'] ),
					'thumbnail_url'        => $row['pictures']['base_link'],
					'title'                => $row['name'],
					'url'                  => $row['player_embed_url'],
					'publish_datetime_gmt' => $row['release_time'],
				),
			);
		}
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}
}
