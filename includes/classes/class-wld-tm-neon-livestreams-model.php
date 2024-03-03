<?php /** @noinspection SqlResolve, SqlNoDataSourceInspection, JsonEncodingApiUsageInspection */

final class WLD_TM_Neon_Livestreams_Model extends WLD_TM_Database_Neon_Livestreams {
	public static function get_count_livestreams() : int {
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

	public static function get_videos() : array {
		global $wpdb;
		$table    = self::get_table_name();
		$products = $wpdb->get_results( "SELECT * FROM $table" );
		$data     = array();

		foreach ( $products as $row ) {
			$data[] = array(
				'id'                   => $row->id,
				'title'                => $row->title,
				'event_id'             => $row->event_id,
				'url'                  => $row->url,
				'thumbnail_url'        => $row->thumbnail_url,
				'publish_datetime_gmt' => $row->publish_datetime_gmt,
			);
		}

		return $data;
	}
}
