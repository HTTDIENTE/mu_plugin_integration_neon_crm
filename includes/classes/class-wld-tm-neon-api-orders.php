<?php

final class WLD_TM_Neon_API_Orders extends WLD_TM_Neon_API {
	public static function get_orders( int $account_id, bool $sync = false ) : array|WP_Error {
		$result = WLD_TM_Neon_API::request(
			'accounts/' . $account_id . '/orders',
		);

		if ( is_wp_error( $result ) ) {
			return $sync ? $result : array();
		}

		return $result['orders'];
	}

	public static function get_order( int $order_id ) : array {
		$result = WLD_TM_Neon_API::request(
			'orders/' . $order_id,
		);

		if ( is_wp_error( $result ) ) {
			return array();
		}

		return $result;
	}

	public static function orders_calculate( int $account_id, array $data ) {
		unset( $data['_locale'] );
		$data['accountId'] = $account_id;
		$result            = WLD_TM_Neon_API::request(
			'orders/calculate',
			$data,
			'POST',
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		/* Removing an Unnecessary Array */
		unset( $result['discounts'] );

		return array(
			'orderCalculationResult' => $result,
		);
	}

	public static function create_order( int $account_id, array $order_data, $return_id = false ) {
		$order_data = self::format_checkout( $order_data, $account_id );

		if ( is_wp_error( $order_data ) ) {
			return $order_data;
		}

		$result = WLD_TM_Neon_API::request(
			'orders',
			$order_data,
			'POST',
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		if ( $return_id ) {
			return $result['id'];
		}

		return self::get_orders( $account_id );
	}

	public static function get_shipping_methods( array $data ) {
		unset( $data['_locale'] );

		$result = WLD_TM_Neon_API::request(
			'orders/shippingMethods',
			$data,
			'POST',
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return array(
			'shippingMethods' => $result,
		);
	}

	public static function format_checkout( array $data, int $account_id ) {
		$data['checkoutData']['accountId'] = $account_id;
		$price = $data['checkoutData'];
		unset( $price['payments'] );
		$price = self::orders_calculate( $account_id, $price );

		if ( is_wp_error( $price ) ) {
			return $price;
		}

		$data['checkoutData']['shippingHandlingFee']   = $price['orderCalculationResult']['shippingHandlingFee'];
		$data['checkoutData']['totalCharge']           = $price['orderCalculationResult']['totalCharge'];
		$data['checkoutData']['subTotal']              = $price['orderCalculationResult']['subTotal'];
		$data['checkoutData']['payments'][0]['amount'] = $price['orderCalculationResult']['totalCharge'];

		return $data['checkoutData'];
	}
}
