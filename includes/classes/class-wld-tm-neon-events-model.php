<?php /** @noinspection SqlResolve, SqlNoDataSourceInspection, JsonEncodingApiUsageInspection */

final class WLD_TM_Neon_Events_Model extends WLD_TM_Database_Neon_Events {
	public static function get_events() : array {
		global $wpdb;

		$table    = self::get_table_name();
		$events   = $wpdb->get_results( "SELECT * FROM $table", ARRAY_A );
		$data     = array();
		if ( $events ) {
			foreach ( $events as $row ) {
				$data[] = self::format_event( $row );
			}
		}
		return $data;
	}

	public static function get_event_by_internal_id( int $internal_event_id ) : array {
		global $wpdb;
		$table = self::get_table_name();
		$event = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE id = %d;",
				$internal_event_id
			),
			ARRAY_A
		);

		return $event ? self::format_event( $event ) : array();
	}

	public static function get_event( int $event_id ) {
		global $wpdb;

		$table = self::get_table_name();
		return $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE neon_event_id = %d", //phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$event_id
			),
			ARRAY_A
		);
	}

	public static function get_count_events() : int {
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

		$count = $wpdb->get_results(
			"
		SELECT * FROM $table
    	AS a
		WHERE NOT exists
		(
			SELECT 1 FROM $table
			AS b
			WHERE b.neon_event_id = a.neon_event_id AND b.id < a.id
		)
		"
		);

		return count( $count );
	}

	public static function format_event( array $data ) : array {
		return array(
			'id'                           => (int) $data['id'],
			'neonEventId'                  => (int) $data['neon_event_id'],
			'title'                        => $data['title'],
			'summary'                      => $data['summary'],
			'description'                  => $data['description'],
			'startDatetimeGMT'             => gmdate( 'Y-m-d\\TH:i:sp', strtotime( $data['start_datetime_gmt'] ) ),
			'endDatetimeGMT'               => gmdate( 'Y-m-d\\TH:i:sp', strtotime( $data['end_datetime_gmt'] ) ),
			'registrationOpenDatetimeGMT'  => gmdate( 'Y-m-d\\TH:i:sp', strtotime( $data['registration_open_datetime_gmt'] ) ),
			'registrationCloseDatetimeGMT' => gmdate( 'Y-m-d\\TH:i:sp', strtotime( $data['registration_close_datetime_gmt'] ) ),
			'categoryId'                   => (int) $data['category_id'],
			'categoryTitle'                => WLD_TM_Neon_Events_Categories_Model::get_category_title( $data['category_id'] ),
			'fees'                         => (float) $data['price'],
			'needRegister'                 => (bool) $data['need_register'],
			'needPayment'                  => (bool) $data['need_payment'],
		);
	}

}
