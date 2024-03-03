<?php

class WLD_TM_Vimeo_API_Videos {
	public static function get_videos() {
		return WLD_TM_Vimeo_API::request(
			'/me/videos',
		);
	}

	public static function get_live() : array {
		$data = self::get_videos();

		foreach ( $data['data'] as $row ) {
			$is_live = $row['embed']['badges']['live']['streaming'];

			if ( $is_live ) {
				return array(
					'event_id'             => str_replace( '/videos/', '', $row['uri'] ),
					'thumbnail_url'        => $row['pictures']['base_link'],
					'title'                => $row['name'],
					'url'                  => $row['player_embed_url'],
					'publish_datetime_gmt' => gmdate( 'Y-m-d H:i:s' ),
				);
			}
		}

		return array();
	}
}
