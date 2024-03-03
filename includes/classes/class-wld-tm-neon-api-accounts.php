<?php

final class WLD_TM_Neon_API_Accounts extends WLD_TM_Neon_API {
	public static function username_exist( string $username ) : array {
		$exist = (bool) self::account_search( $username );

		return array(
			'isAvailable' => $exist ? false : true,
		);
	}

	public static function email_exist( string $email ) : array {
		$exist = (bool) self::account_search( $email );

		return array(
			'isAvailable' => $exist ? false : true,
		);
	}

	public static function account_search( string $username = '', string $email = '' ) {
		$params = array(
			'outputFields' => array(
				'Account ID',
			),
			'searchFields' => array(
				array(
					'field'    => 'Email',
					'operator' => 'EQUAL',
					'value'    => $email,
				),
			),
			'pagination'   => array(
				'currentPage' => 0,
				'pageSize'    => 1,
			),
		);

		if ( ! empty( $username ) ) {
			$params['searchFields'][0]['field'] = 'Account Login Name';
			$params['searchFields'][0]['value'] = $username;
		}

		return WLD_TM_Neon_API::request(
			'accounts/search',
			$params,
			'POST'
		)['searchResults'];
	}

	public static function create_account( array $account_data ) {
		if ( isset( $account_data['login']['confirm-password'] ) && $account_data['login']['password'] !== $account_data['login']['confirm-password'] ) {
			return new WP_Error(
				'create_account',
				'neon_error',
				array(
					'code'    => 'password_mismatch',
					'message' => 'Password and confirm password mismatch, please try again.',
				)
			);
		}

		unset( $account_data['login']['confirm-password'] );

		$account = WLD_TM_Neon_API::request(
			'accounts',
			array(
				'individualAccount' => $account_data,
			),
			'POST'
		);

		if ( is_wp_error( $account ) ) {
			return $account;
		}

		WLD_TM_Database_Neon_Sync::update_sync_data( 'account', $account['id'] );

		return $account['id'];

	}

	public static function get_account( int $account_id, bool $bearer = false ) : array|WP_Error {
		$result = WLD_TM_Neon_API::request(
			'accounts/' . $account_id,
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		if ( $bearer ) {
			return array(
				'auth'    => array(
					'authorizationCode' => WLD_TM_Database_Neon_Auth::get_token_from_account( $account_id ),
				),
				'account' => array(
					'primaryContact' => $result['individualAccount']['primaryContact'],
					'login'          => array(
						'username' => $result['individualAccount']['login']['username'],
					),
				),
			);
		}

		return array(
			'account' => array(
				'primaryContact' => $result['individualAccount']['primaryContact'],
				'login'          => array(
					'username' => $result['individualAccount']['login']['username'],
				),
			),
		);
	}
}
