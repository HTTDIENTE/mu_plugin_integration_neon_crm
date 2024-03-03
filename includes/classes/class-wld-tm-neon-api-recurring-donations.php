<?php

class WLD_TM_Neon_API_Recurring_Donations extends WLD_TM_Neon_API {
	public static function get_recurring_donations( int $account_id ) : array|WP_Error {
		$recurring_data = array();
		$result         = WLD_TM_Neon_API::request(
			'/recurring',
			array(
				'accountId' => $account_id,
			),
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		if ( isset( $result['recurringDonations'] ) ) {
			foreach ( $result['recurringDonations'] as $recurring ) {
				$recurring['frequency']               = preg_replace( '/[^A-Z]/', '', $recurring['frequency'] );
				$recurring_data['recurringDonations'] = array(
					array(
						'id'        => $recurring['id'],
						'amount'    => $recurring['amount'],
						'nextDate'  => $recurring['nextDate'],
						'frequency' => $recurring['frequency'],
					),
				);
			}
		}
		return $recurring_data;
	}

	public static function delete_recurring_donation( int $account_id, int $recurring_id ) {
		$result         = WLD_TM_Neon_API::request(
			'recurring/' . $recurring_id,
			array(),
			'DELETE'
		);

		$recurring_data = self::get_recurring_donations( $account_id );

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return $recurring_data;
	}

	public static function update_recurring_donation_payment( int $account_id, array $recurring_data ) {
		$result = WLD_TM_Neon_API::request(
			'recurring/' . $recurring_data['id'],
			array(
				'id'               => $recurring_data['id'],
				'accountId'        => $account_id,
				'creditCardOnline' => array(
					'token' => $recurring_data['token'],
				),
			),
			'PATCH',
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return self::get_recurring_donations( $account_id );
	}

	public static function update_recurring_donation( int $account_id, array $recurring_data ) {
		$result = WLD_TM_Neon_API::request(
			'recurring/' . $recurring_data['id'],
			array(
				'id'                  => $recurring_data['id'],
				'amount'              => $recurring_data['amount'],
				'recurringPeriodType' => $recurring_data['recurringPeriodType'],
				'nextDate'            => $recurring_data['nextDate'],
				'accountId'           => $account_id,
				'recurringPeriod'     => $recurring_data['recurringPeriod'],
			),
			'PATCH',
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return self::get_recurring_donations( $account_id );
	}

	public static function create_donation( int $account_id, array $data ) {
		$data['accountId'] = $account_id;

		$result = WLD_TM_Neon_API::request(
			'recurring',
			$data,
			'POST'
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		WLD_TM_Database_Neon_Sync::update_sync_data( 'recurring_donations', $account_id );

		return self::get_recurring_donations( $account_id )['recurringDonations'];
	}
}
