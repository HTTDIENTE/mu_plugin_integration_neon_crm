<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

class WLD_TM_Database_Neon_Events {
	protected static string $cron = 'wld_events_cron';
	protected static string $name   = 'tm_events';
	protected static string $scheme = '
		id int(11) unsigned NOT NULL AUTO_INCREMENT,
		neon_event_id int(11) NOT NULL,
		title varchar(1024) NOT NULL,
		summary varchar(1024) NOT NULL,
		description varchar(1024) NOT NULL,
		start_datetime_gmt varchar(1024) DEFAULT NULL,
		end_datetime_gmt varchar(1024) DEFAULT NULL,
		registration_open_datetime_gmt varchar(1024) DEFAULT NULL,
		registration_close_datetime_gmt varchar(1024) DEFAULT NULL,
		price varchar(1024) NOT NULL,
		need_register varchar(11) NOT NULL,
		need_payment varchar(11) NOT NULL,
		category_id int(11) NOT NULL,
		PRIMARY KEY  (id)
	';

	public static function init() : void {
		add_action(
			self::$cron,
			array( self::class, 'cron_start' ),
		);
		add_action(
			self::$cron . '_once',
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

	public static function cron_start() : WP_Error|bool {
		delete_transient( 'wld_last_insert_events' );
		set_transient( 'wld_last_insert_events', '1', time() + 19 );

		wp_clear_scheduled_hook( self::$cron . '_once' );
		wp_schedule_single_event( time() + 20, self::$cron . '_once' );

		WLD_TM_Database_Neon_Events_TMP::clear_table();
		WLD_TM_Database_Neon_Events_List_TMP::clear_table();
		return true;
	}

	public static function is_cron() : bool {
		get_transient( 'wld_last_insert_events' );
		return (bool) get_transient( 'wld_last_insert_events' );
	}

	public static function cron() : void {
		wp_schedule_single_event( time() + 60, self::$cron . '_once' );

		if ( get_transient( 'wld_last_insert_events' ) ) {
			return;
		}

		# If events exist in tmp table
		if ( WLD_TM_Database_Neon_Events_TMP::update_events_tmp() ) {
			WLD_TM_Log::log(
				'info',
				'-------------Events imported, transfer to real table------------',
				'insert-events'
			);
			wp_clear_scheduled_hook( self::$cron . '_once' );

			# Transfer events from tmp table to real table
			self::update_events();

			WLD_TM_Database_Neon_Events_TMP::clear_table();
			WLD_TM_Database_Neon_Events_List_TMP::clear_table();
			WLD_TM_Database_Neon_Sync::update_sync_data( 'events' );

			WLD_TM_Log::log(
				'info',
				'-------------Events imported, transfer completed!------------',
				'insert-events'
			);

			delete_transient( 'wld_last_insert_events' );
			wp_clear_scheduled_hook( self::$cron . '_once' );

			# Update events categories
			$events_categories = WLD_TM_Neon_API_Events::get_categories();

			if ( is_wp_error( $events_categories ) ) {
				return;
			}

			WLD_TM_Neon_Events_Categories_Model::update_categories( $events_categories );

			WLD_TM_Log::log(
				'info',
				'-------------Events categories imported, transfer completed!------------',
				'insert-events'
			);
		}
	}

	public static function clear_table() : void {
		$table = self::get_table_name();

		global $wpdb;
		$wpdb->query(
			"DELETE FROM $table WHERE 1"
		);
	}

	public static function update_events() : void {
		global $wpdb;

		self::clear_table();

		$table     = self::get_table_name();
		$table_tmp = WLD_TM_Database_Neon_Events_TMP::get_table_name();

		if ( ! self::has_table( $table ) ) {
			self::create();
		}

		$wpdb->query( "INSERT INTO $table SELECT * FROM $table_tmp" );
	}

	private static function has_table( string $table ) : bool {
		global $wpdb;

		return $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) === $table;
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}
}
