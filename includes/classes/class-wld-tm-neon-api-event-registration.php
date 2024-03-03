<?php

final class WLD_TM_Neon_API_Event_Registration extends WLD_TM_Neon_API {
	public static function registration( int $account_id, array $data ) {
		$data   = self::formatted_event_data( $data, $account_id );
		$result = WLD_TM_Neon_API::request(
			'eventRegistrations',
			$data,
			'POST',
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		unset( $result['accountId'] );

		return $result;
	}

	public static function formatted_event_data( array $data, int $account_id ) : array {
		$event_by_id = WLD_TM_Neon_Events_Model::get_event_by_internal_id( $data['eventId'] );
		$ticket_id   = WLD_TM_Neon_API_Events::get_fee_by_ticket( $event_by_id['neonEventId'] )['ticket_id'];

		if ( ! isset( $data['tickets'] ) ) {
			$data['tickets'] = array();
		}

		for ( $i = 0; $i < $data['numberOfTickets']; $i ++ ) {
			$data['tickets'][ $i ]['attendees'][0]['accountId'] = $account_id;
			$data['tickets'][ $i ]['ticketId']                  = $ticket_id;
			$data['tickets'][ $i ]['ticketSequence']            = 1;
		}

		$event_price                   = $event_by_id['fees'] * $data['numberOfTickets'];
		$data['registrantAccountId']   = $account_id;
		$data['payments'][0]['amount'] = $event_price;

		if ( empty( $event_price ) && isset( $data['payments'] ) ) {
			unset( $data['payments'] );
			$data['registrationAmount'] = 0;
		} else {
			$data['registrationAmount'] = $event_price;
		}

		$data['eventId'] = $event_by_id['neonEventId'];

		unset( $data['numberOfTickets'] );

		return $data;
	}
}
