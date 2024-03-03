<?php

class WLD_TM_Neon_API_Donations extends WLD_TM_Neon_API {
	public static function create_donation( int $account_id, array $data ) {
		$data['accountId']                 = $account_id;
		$data['payments'][0]['tenderType'] = 4;

		$result = WLD_TM_Neon_API::request(
			'donations',
			$data,
			'POST'
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return array();
	}

	public static function get_donation( int $donation_id ) {
		return WLD_TM_Neon_API::request(
			'donations/' . $donation_id,
		);
	}
}
