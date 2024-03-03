<?php

final class WLD_TM_Assets {
	public static function init() : void {
		add_action(
			'wp_enqueue_scripts',
			array( self::class, 'enqueue' )
		);
	}

	public static function enqueue() : void {
		$asset_data_paths = glob( WLD_TM_PATH . 'build/*.asset.php' );
		if ( $asset_data_paths ) {
			$runtime_handle = 'wld-the-merge-runtime';
			foreach ( $asset_data_paths as $asset_data_path ) {
				$data   = include $asset_data_path;
				$name   = basename( $asset_data_path, '.asset.php' );
				$url    = WLD_TM_URL . 'build/' . $name;
				$path   = WLD_TM_PATH . 'build/' . $name;
				$handle = 'wld-the-merge-' . $name;

				if ( file_exists( $path . '.js' ) ) {
					if ( $runtime_handle !== $handle ) {
						$dependencies = array_merge( $data['dependencies'], array( $runtime_handle ) );
					} else {
						$dependencies = $data['dependencies'];
					}

					wp_register_script(
						$handle,
						$url . '.js',
						$dependencies,
						$data['version'],
						true
					);
				}
				if ( file_exists( $path . '.css' ) ) {
					wp_register_style(
						$handle,
						$url . '.css',
						array(),
						$data['version']
					);
				}
			}

			$neon       = new WLD_TM_REST_Controller_Neon();
			$livestream = new WLD_TM_REST_Controller_Livestream();
			wp_add_inline_script(
				$runtime_handle,
				"
					window.neon = {
						namespace: '" . esc_js( $neon->get_namespace() ) . "',
						organizationId: '" . WLD_TM_Settings::get( 'neon_organization_id' ) . "',
						subscriptionNewsLatterId: '". WLD_TM_Settings::get( 'neon_subscription_newslatter_id' ) ."',
						subscriptionBlogId: '". WLD_TM_Settings::get( 'neon_subscription_blog_id' ) ."',
						clientId: '" . WLD_TM_Settings::get( 'neon_client_id' ) . "',
						merchantId: '" . WLD_TM_Settings::get( 'neon_merchant_id' ) . "',
						payApiKey: '" . WLD_TM_Settings::get( 'neon_pay_api_key' ) . "',
						payJsUrl: 'https://cdn.sbx.neononepay.com/1.4/neonpay.js',
						pages: {
							onlineStore: '/" . esc_js( WLD_TM_Pages::get_path( 'online_store' ) ) . "',
							events: '/" . esc_js( WLD_TM_Pages::get_path( 'events' ) ) . "',
							donations: '/" . esc_js( WLD_TM_Pages::get_path( 'donations_page' ) ) . "',
							thankYouPage: '/" . esc_js( WLD_TM_Pages::get_path( 'thank_you_page' ) ) . "',
							oneTimeDonationThankYouPage: '/" . esc_js( WLD_TM_Pages::get_path( 'one_time_donation_thank_you_page' ) ) . "',
							recurringDonationThankYouPage: '/" . esc_js( WLD_TM_Pages::get_path( 'recurring_donation_thank_you_page' ) ) . "',
							eventRegistrationsThankYouPage: '/" . esc_js( WLD_TM_Pages::get_path( 'events_thank_you_page' ) ) . "',
							subscribeThankYouPage: '/" . esc_js( WLD_TM_Pages::get_path( 'subscribe_thank_you_page' ) ) . "',
						}
					};
					window.livestream = {
						namespace: '" . esc_js( $livestream->get_namespace() ) . "',
						pages: {
							livestream: '/" . esc_js( WLD_TM_Pages::get_path( 'livestream_page' ) ) . "',
						}
					};
				"
			);
		}
	}
}
