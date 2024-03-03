<?php /** @noinspection AutoloadingIssuesInspection */

trait WLD_TM_Data_Clean {
	public static function clean( array &$data ) : void {
		foreach ( $data as &$item ) {
			if ( is_string( $item ) ) {
				$item = wp_strip_all_tags( $item );
			} elseif ( is_array( $item ) ) {
				self::clean( $item );
			} elseif ( is_object( $item ) ) {
				$item = get_object_vars( $item );
				self::clean( $item );
			}
		}
	}
}
