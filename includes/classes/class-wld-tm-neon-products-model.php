<?php /** @noinspection SqlResolve, SqlNoDataSourceInspection, JsonEncodingApiUsageInspection */

final class WLD_TM_Neon_Products_Model extends WLD_TM_Database_Neon_Products {
	public static function get_count_products() : int {
		global $wpdb;
		$table = self::get_table_name();
		$query = $wpdb->query(
			$wpdb->prepare(
				"SHOW TABLES LIKE %s", //phpcs:ignore Squiz.Strings.DoubleQuoteUsage.NotRequired
				$table
			),
		);

		if ( empty( $query ) ) {
			return 0;
		}

		return count(
			$wpdb->get_results( "SELECT * FROM $table" ) //phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		);
	}

	public static function get_products() : array {
		global $wpdb;
		$table    = self::get_table_name();
		$products = $wpdb->get_results( "SELECT * FROM $table" ); //phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		$data     = array();

		foreach ( $products as $row ) {
			$data[] = array(
				'id'            => (int) $row->product_id,
				'categoryId'    => (int) $row->category_id,
				'categoryTitle' => WLD_TM_Neon_Products_Categories_Model::get_category_title( $row->category_id ),
				'title'         => $row->title,
				'code'          => $row->code,
				'description'   => $row->description,
				'price'         => (float) $row->price,
				'images'        => json_decode( $row->images, true ),
			);
		}

		return $data;
	}

	public static function get_product_by_id( int $product_id ) {
		global $wpdb;

		$table = self::get_table_name();

		return $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM $table WHERE product_id = %d", //phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
				$product_id
			),
		);
	}
}
