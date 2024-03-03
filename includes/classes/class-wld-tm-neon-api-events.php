<?php

final class WLD_TM_Neon_API_Events extends WLD_TM_Neon_API {
	public static function get_event( int $event_id ) {
		return WLD_TM_Neon_API::request(
			'events/' . $event_id
		);
	}

	public static function get_events() {
		return WLD_TM_Neon_API::request(
			'events/search/',
			array(
				'outputFields' => array(
					'Event ID',
				),
				'searchFields' => array(
					array(
						'field'    => 'Event Archived',
						'operator' => 'NOT_EQUAL',
						'value'    => '1',
					),
					/*array(
						'field'    => 'Event Category',
						'operator' => 'NOT_BLANK',
					),*/
				),
				'pagination'   => array(
					'pageSize'      => 0,
					'sortDirection' => 'DESC',
				),
			),
			'POST'
		);
	}

	public static function get_categories() {
		$result = WLD_TM_Neon_API::request(
			'events/categories'
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return $result;
	}

	public static function get_fee_by_ticket( int $event_id ) : array {
		$tickets =  WLD_TM_Neon_API::request(
			'events/' . $event_id . '/tickets',
		);

		if ( empty( $tickets ) || is_wp_error( $tickets ) ) {
			return array(
				'fee'       => 0.0,
				'ticket_id' => 0,
			);
		}

		return array(
			'fee'       => (float) $tickets[0]['fee'],
			'ticket_id' => (int) $tickets[0]['id'],
		);
	}
}
