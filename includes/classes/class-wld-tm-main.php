<?php

final class WLD_TM_Main {
	public static function init() : void {
		add_action(
			'admin_init',
			array( self::class, 'admin_init' ),
		);

		WLD_TM_Settings::init();

		if ( WLD_TM_Utils::is_rest() ) {
			WLD_TM_REST::init();
		} else {
			WLD_TM_Assets::init();
			WLD_TM_Pages::init();
			WLD_TM_Shortcodes::init();
		}

		add_action(
			'wp_dashboard_setup',
			array( self::class, 'add_dashboard_widget' )
		);

		WLD_TM_Database_Neon_Products::init();
		WLD_TM_Database_Neon_Livestreams::init();
		WLD_TM_Database_Neon_Events::init();
	}

	public static function admin_init() : void {
		if ( wp_doing_ajax() ) {
			return;
		}

		WLD_TM_Pages::admin_init();

		self::clear_neon_cache();

		// We deliberately do not use a nonce here, since this is only a trigger,
		// and we have a check that the administrator is executing it.
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$action = $_GET['wld_the_merge_action'] ?? '';
		if ( $action && current_user_can( 'manage_options' ) ) {
			if ( 'create_tables' === $action ) {
				WLD_TM_Database_Neon_Events_TMP::create();
				WLD_TM_Database_Neon_Events::create();
				WLD_TM_Database_Neon_Events_List_TMP::create();
				WLD_TM_Database_Neon_Auth::create();
				WLD_TM_Database_Neon_Sync::create();
				WLD_TM_Database_Neon_Products_Categories::create();
				WLD_TM_Database_Neon_Products::create();
				WLD_TM_Database_Neon_Livestreams::create();
			} elseif ( 'set_rules' === $action ) {
				flush_rewrite_rules();
			} elseif ( 'create_cron' === $action ) {
				$crons = array(
					'wld_products_cron',
					'wld_events_cron',
					'wld_vimeo_cron',
				);

				foreach ( $crons as $row ) {
					wp_clear_scheduled_hook( $row );
					wp_schedule_event( time(), 'twicedaily', $row );
				}
			}
		}
	}

	public static function clear_neon_cache() : void {
		$data = isset( $_GET['neon_clear_cache'] ); // phpcs:ignore WordPress.Security.NonceVerification
		if ( $data ) {
			do_action( 'wld_vimeo_cron' );
			do_action( 'wld_products_cron' );
			do_action( 'wld_events_cron' );

			exit( wp_safe_redirect( admin_url() ) );
		}
	}

	public static function add_dashboard_widget() : void {
		wp_add_dashboard_widget(
			self::class,
			esc_html__( 'Neon', 'parent-theme' ),
			static function () {
				$url = add_query_arg( 'neon_clear_cache', 1, admin_url() );

				?>
				<table>
				<tr>
					<td>Accounts synced</td>
					<td><?php echo WLD_TM_Neon_Sync_Model::get_sync_count( 'accounts' ); ?></td>
				</tr>
				<tr>
					<td>Events synced</td>
					<td>
						<?php
						if ( WLD_TM_Database_Neon_Events::is_cron() ) {
							echo 'Synchronization';
						} else {
							echo WLD_TM_Neon_Sync_Model::get_sync_count( 'events' );
						}
						?>
					</td>
				</tr>
				<tr>
					<td>Products synced</td>
					<td><?php echo WLD_TM_Neon_Sync_Model::get_sync_count( 'products' ); ?></td>
				</tr>
				<tr>
					<td>Livestreams synced</td>
					<td><?php echo WLD_TM_Neon_Sync_Model::get_sync_count( 'livestreams' ); ?></td>
				</tr>
				</table>
				<a <?php echo WLD_TM_Database_Neon_Events::is_cron() ? 'disabled' : ''; ?> href="<?php echo $url; ?>" class="button"><?php echo esc_html__( 'Clear Neon Cache', 'parent-theme' ); ?></a>
				<?php
			}
		);
	}
}
