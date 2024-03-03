<?php /** @noinspection SqlResolve, SqlNoDataSourceInspection, JsonEncodingApiUsageInspection */

final class WLD_TM_Neon_Events_Categories_Model extends WLD_TM_Database_Neon_Events_Categories {
	public static function get_categories() : array {
		$table = self::get_table_name();

		global $wpdb;
		$result = $wpdb->get_results( "SELECT * FROM $table" );

		if ( empty( $result ) ) {
			return array();
		}

		return $result;
	}

	public static function get_category_title( int $category_id ) : string {
		$table = self::get_table_name();

		global $wpdb;
		$result = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT title FROM $table WHERE category_id = %d",
				$category_id
			)
		);

		return $result->title ?? '';
	}
}
