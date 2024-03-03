<?php

final class WLD_TM_Settings {
	private static array $settings = array();

	private static string $environment = '';

	public static function init() : void {
		$sandbox = checked( (bool) get_option( 'live_or_sandbox' ), true, false );
		$options = array(
			'environment' => $sandbox ? 'development' : 'production',
			'development' => array(
				'neon_organization_id'            => get_option( 'neon_organization_id_sandbox' ),
				'neon_api_key'                    => get_option( 'neon_api_key_sandbox' ),
				'neon_client_id'                  => get_option( 'neon_client_id_sandbox' ),
				'neon_client_secret'              => get_option( 'neon_client_secret_sandbox' ),
				'neon_subscription_newslatter_id' => get_option( 'neon_subscription_newslatter_id_sandbox' ),
				'neon_subscription_blog_id'       => get_option( 'neon_subscription_blog_id_sandbox' ),
				'neon_pay_api_key'                => get_option( 'neon_pay_api_key_sandbox' ),
				'neon_merchant_id'                => get_option( 'neon_merchant_id_sandbox' ),
				'vimeo_access_token'              => get_option( 'vimeo_access_token_sandbox' ),
				'vimeo_client_id'                 => get_option( 'vimeo_client_id_sandbox' ),
				'vimeo_client_secret'             => get_option( 'vimeo_client_secret_sandbox' ),
			),
			'production'  => array(
				'neon_organization_id'            => get_option( 'neon_organization_id' ),
				'neon_api_key'                    => get_option( 'neon_api_key' ),
				'neon_client_id'                  => get_option( 'neon_client_id' ),
				'neon_client_secret'              => get_option( 'neon_client_secret' ),
				'neon_subscription_newslatter_id' => get_option( 'neon_subscription_newslatter_id' ),
				'neon_subscription_blog_id'       => get_option( 'neon_subscription_blog_id' ),
				'neon_pay_api_key'                => get_option( 'neon_pay_api_key' ),
				'neon_merchant_id'                => get_option( 'neon_merchant_id' ),
				'vimeo_access_token'              => get_option( 'vimeo_access_token' ),
				'vimeo_client_id'                 => get_option( 'vimeo_client_id' ),
				'vimeo_client_secret'             => get_option( 'vimeo_client_secret' ),
			),
		);

		self::$environment = $options['environment'];
		self::$settings    = array_merge( $options, $options[ self::$environment ] );
		$pages_keys        = explode( ',', self::get_pages_id( $sandbox, true ) );

		# Adding pages id to array settings
		foreach ( $pages_keys as $page ) {
			self::$settings[ $page ] = get_option( $page );
		}

		add_action(
			'init',
			array( self::class, 'menu' ),
		);

	}

	public static function get( string $key ) : string {
		return self::$settings[ $key ] ?? '';
	}

	public static function get_page_id( string $key ) : int {
		$key .= 'development' === self::$environment ? '_post_id_sandbox' : '_post_id';

		return (int) ( self::$settings[ $key ] . '_post_id' ?? '0' );
	}

	public static function menu() {
		if ( function_exists( 'add_menu_page' ) ) {
			add_menu_page(
				'Neon CRM Settings',
				'Neon CRM',
				'manage_options',
				'neon_crm_settings',
				array( self::class, 'page' ),
				'dashicons-admin-generic',
			);
		}
	}

	public static function page() {
		$sandbox        = checked( (bool) get_option( 'live_or_sandbox' ), true, false );
		$pages_template = self::get_pages_id( $sandbox );
		$pages_keys     = self::get_pages_id( $sandbox, true );

		if ( ! $sandbox ) {
			echo '
				<h3>Neon CRM Settings</h3>
				<form action="options.php" method="post" id="form-neon-settings">
				' . wp_nonce_field( 'update-options' ) . '
					<style>
						.form-block {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							width: 35%;
						}
						.form-row {
						margin: 5px;
						}
					</style>
					<table class="form-table">
						<tbody>
							<tr>

								<th scope="row">
									Sandbox
								</th>
								<td>
									<input name="live_or_sandbox" type="checkbox" id="live_or_sandbox" ' . $sandbox . '>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_organization_id">Neon Organization ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_organization_id" id="neon_organization_id" value="' . get_option( "neon_organization_id" ) . '">
									<a href="https://' . get_option( "neon_organization_id" ) . '.app.neoncrm.com/np/admin/systemsetting/orgProfile.do">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_api_key">Neon API Key</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_api_key" id="neon_api_key" value="' . get_option( "neon_api_key" ) . '">
									<a href="https://' . get_option( "neon_organization_id" ) . '.app.neoncrm.com/admin/users/list">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_client_id">Neon Client ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_client_id" id="neon_client_id" value="' . get_option( "neon_client_id" ) . '">
									<a href="https://' . get_option( "neon_organization_id" ) . '.app.neoncrm.com/np/admin/systemsetting/viewOauthProfile.do">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_client_secret">Neon Client Secret</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_client_secret" id="neon_client_secret" value="' . get_option( "neon_client_secret" ) . '">
									<a href="https://' . get_option( "neon_organization_id" ) . '.app.neoncrm.com/np/admin/systemsetting/viewOauthProfile.do">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_subscription_newslatter_id">Neon Subscription Newslatter ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_subscription_newslatter_id" id="neon_subscription_newslatter_id" value="' . get_option( "neon_subscription_newslatter_id" ) . '">
									<a href="https://' . get_option( "neon_organization_id" ) . '.neoncrm.com/admin/email-audiences/list">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_subscription_blog_id">Neon Subscription Blog ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_subscription_blog_id" id="neon_subscription_blog_id" value="' . get_option( "neon_subscription_blog_id" ) . '">
									<a href="https://' . get_option( "neon_organization_id" ) . '.neoncrm.com/admin/email-audiences/list">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_pay_api_key">Neon Pay API Key</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_pay_api_key" id="neon_pay_api_key" value="' . get_option( "neon_pay_api_key" ) . '">
									<a href="https://app.neononepay.com/home">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_merchant_id">Neon Merchant ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_merchant_id" id="neon_merchant_id" value="' . get_option( "neon_merchant_id" ) . '">
									<a href="https://app.neononepay.com/home">View Neon</a>
								</td>
							</tr>
							' . $pages_template . '
							<tr>
								<th scope="row">
									<label for="vimeo_access_token">Vimeo Access Token</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="vimeo_access_token" id="vimeo_access_token" value="' . get_option( "vimeo_access_token" ) . '">
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="vimeo_client_id">Vimeo Client ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="vimeo_client_id" id="vimeo_client_id" value="' . get_option( "vimeo_client_id" ) . '">
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="vimeo_client_id">Vimeo Client Secret</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="vimeo_client_secret" id="vimeo_client_secret" value="' . get_option( "vimeo_client_secret" ) . '">
								</td>
							</tr>
						</tbody>
					</table>
					<p class="submit">
						<input type="submit" value="Save Changes" class="button button-primary">
					</p>
					<input type="hidden" name="action" value="update" />
					<input type="hidden" name="page_options" value="neon_organization_id,neon_api_key,neon_client_id,neon_client_secret,
					vimeo_access_token,vimeo_client_id,vimeo_client_secret,neon_subscription_blog_id,neon_subscription_newslatter_id,
					neon_pay_api_key,neon_merchant_id,live_or_sandbox, ' . $pages_keys . '" />
				</form>
				<script>
					document.getElementById("live_or_sandbox").addEventListener("change", (event) => {
                        document.getElementById("form-neon-settings").submit();
                        document.getElementById("form-neon-settings").style.opacity = "0.7";
                        document.getElementById("form-neon-settings").style.pointerEvents = "none";
					});
				</script>
			';
		} else {
			echo '
				<h3>Neon CRM Settings (Sandbox)</h3>
				<form action="options.php" method="post" id="form-neon-settings">
				' . wp_nonce_field( 'update-options' ) . '
					<style>
						.form-block {
							display: flex;
							flex-direction: row;
							flex-wrap: wrap;
							width: 35%;
						}
						.form-row {
						margin: 5px;
						}
					</style>
					<table class="form-table">
						<tbody>
							<tr>

								<th scope="row">
									Sandbox
								</th>
								<td>
									<input name="live_or_sandbox" type="checkbox" id="live_or_sandbox" ' . $sandbox . '>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_organization_id_sandbox">Neon Organization ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_organization_id_sandbox" id="neon_organization_id_sandbox" value="' . get_option( "neon_organization_id_sandbox" ) . '">
									<a href="https://' . get_option( "neon_organization_id_sandbox" ) . '.app.neoncrm.com/np/admin/systemsetting/orgProfile.do">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_api_key_sandbox">Neon API Key</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_api_key_sandbox" id="neon_api_key_sandbox" value="' . get_option( "neon_api_key_sandbox" ) . '">
									<a href="https://' . get_option( "neon_organization_id_sandbox" ) . '.app.neoncrm.com/admin/users/list">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_client_id_sandbox">Neon Client ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_client_id_sandbox" id="neon_client_id_sandbox" value="' . get_option( "neon_client_id_sandbox" ) . '">
									<a href="https://' . get_option( "neon_organization_id_sandbox" ) . '.app.neoncrm.com/np/admin/systemsetting/viewOauthProfile.do">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_client_secret_sandbox">Neon Client Secret</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_client_secret_sandbox" id="neon_client_secret_sandbox" value="' . get_option( "neon_client_secret_sandbox" ) . '">
									<a href="https://' . get_option( "neon_organization_id_sandbox" ) . '.app.neoncrm.com/np/admin/systemsetting/viewOauthProfile.do">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_subscription_newslatter_id_sandbox">Neon Subscription Newslatter ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_subscription_newslatter_id_sandbox" id="neon_subscription_newslatter_id_sandbox" value="' . get_option( "neon_subscription_newslatter_id_sandbox" ) . '">
									<a href="https://' . get_option( "neon_organization_id_sandbox" ) . '.neoncrm.com/admin/email-audiences/list">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_subscription_blog_id">Neon Subscription Blog ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_subscription_blog_id_sandbox" id="neon_subscription_blog_id_sandbox" value="' . get_option( "neon_subscription_blog_id_sandbox" ) . '">
									<a href="https://' . get_option( "neon_organization_id_sandbox" ) . '.neoncrm.com/admin/email-audiences/list">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_pay_api_key_sandbox">Neon Pay API Key</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_pay_api_key_sandbox" id="neon_pay_api_key_sandbox" value="' . get_option( "neon_pay_api_key_sandbox" ) . '">
									<a href="https://app.neononepay.com/home">View Neon</a>
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="neon_merchant_id_sandbox">Neon Merchant ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="neon_merchant_id_sandbox" id="neon_merchant_id_sandbox" value="' . get_option( "neon_merchant_id_sandbox" ) . '">
									<a href="https://app.neononepay.com/home">View Neon</a>
								</td>
							</tr>
							' . $pages_template . '
							<tr>
								<th scope="row">
									<label for="vimeo_access_token_sandbox">Vimeo Access Token</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="vimeo_access_token_sandbox" id="vimeo_access_token_sandbox" value="' . get_option( "vimeo_access_token_sandbox" ) . '">
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="vimeo_client_id_sandbox">Vimeo Client ID</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="vimeo_client_id_sandbox" id="vimeo_client_id_sandbox" value="' . get_option( "vimeo_client_id_sandbox" ) . '">
								</td>
							</tr>
							<tr>
								<th scope="row">
									<label for="vimeo_client_id_sandbox">Vimeo Client Secret</label>
								</th>
								<td>
									<input class="regular-text" type="text" name="vimeo_client_secret_sandbox" id="vimeo_client_secret_sandbox" value="' . get_option( "vimeo_client_secret_sandbox" ) . '">
								</td>
							</tr>
						</tbody>
					</table>
					<p class="submit">
						<input type="submit" value="Save Changes" class="button button-primary">
					</p>
					<input type="hidden" name="action" value="update" />
					<input type="hidden" name="page_options" value="neon_organization_id_sandbox,neon_api_key_sandbox,neon_client_id_sandbox,neon_client_secret_sandbox,
					,vimeo_access_token_sandbox,vimeo_client_id_sandbox,vimeo_client_secret_sandbox,neon_subscription_blog_id_sandbox,neon_subscription_newslatter_id_sandbox,
					neon_pay_api_key_sandbox,neon_merchant_id_sandbox,live_or_sandbox,' . $pages_keys . '" />
				</form>
				<script>
					document.getElementById("live_or_sandbox").addEventListener("change", (event) => {
                        document.getElementById("form-neon-settings").submit();
                        document.getElementById("form-neon-settings").style.opacity = "0.7";
                        document.getElementById("form-neon-settings").style.pointerEvents = "none";
					});
				</script>
			';
		}
	}

	public static function get_pages_id( $sandbox, $keys = false ) {
		$pages = array(
			'Online Store'                 => 'online_store_post_id',
			'Events'                       => 'events_post_id',
			'Donations'                    => 'donations_page_post_id',
			'Livestream'                   => 'livestream_page_post_id',
			'Order Thank you'              => 'thank_you_page_post_id',
			'One time donation thank you'  => 'one_time_donation_thank_you_page_post_id',
			'Recurring donation thank you' => 'recurring_donation_thank_you_page_post_id',
			'Events thank you'             => 'events_thank_you_page_post_id',
			'Subscribe thank you'          => 'subscribe_thank_you_page_post_id',
		);

		if ( $keys ) {
			$explode = '';
			foreach ( $pages as $row ) {
				if ( $sandbox ) {
					$explode .= $row . '_sandbox,';
				} else {
					$explode .= $row . ',';
				}
			}

			return rtrim( $explode, ',' );
		}

		ob_start();
		?>
		<?php foreach ( $pages as $key => $page ) : ?>
			<?php if ( $sandbox ) : ?>
				<tr>
					<th scope="row">
						<label for="<?php echo $page; ?>_sandbox"><?php echo $key; ?></label>
					</th>
					<td>
						<?php
						echo sprintf(
							'%s',
							wp_dropdown_pages(
								array(
									'name'              => $page . '_sandbox',
									'echo'              => '0',
									'show_option_none'  => '&mdash; Select &mdash;',
									'option_none_value' => '0',
									'selected'          => get_option( $page . '_sandbox' ),
								),
							),
						);
						?>
					</td>
				</tr>
			<?php else : ?>
				<tr>
					<th scope="row">
						<label for="<?php echo $page; ?>"><?php echo $key; ?></label>
					</th>
					<td>
						<?php
						wp_dropdown_pages(
							array(
								'name'              => $page,
								'show_option_none'  => '&mdash; Select &mdash;',
								'option_none_value' => '0',
								'selected'          => get_option( $page ),
							)
						);
						?>
					</td>
				</tr>
			<?php endif; ?>
		<?php endforeach; ?>
		<?php
		$content = ob_get_contents();
		ob_get_clean();

		return $content;
	}
}
