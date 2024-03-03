<?php

final class WLD_TM_Neon_API_Accounts_Edit extends WLD_TM_Neon_API {
	public static function update_account( int $account_id, array $data ) {
		$result = WLD_TM_Neon_API::request(
			'accounts/' . $account_id,
			$data,
			'PATCH'
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account_id );

		return WLD_TM_Neon_API_Accounts::get_account( $account_id );
	}
}
