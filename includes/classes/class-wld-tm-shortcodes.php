<?php

final class WLD_TM_Shortcodes {
	public static function init() : void {
		add_shortcode(
			'neon_auth',
			array( self::class, 'neon_auth' )
		);
		add_shortcode(
			'neon_online_store',
			array( self::class, 'neon_online_store' )
		);
		add_shortcode(
			'neon_account',
			array( self::class, 'neon_account' )
		);
		add_shortcode(
			'neon_donations',
			array( self::class, 'neon_donations' )
		);
		add_shortcode(
			'neon_events',
			array( self::class, 'neon_events' )
		);
		add_shortcode(
			'neon_cart_checkout',
			array( self::class, 'neon_cart_checkout' )
		);
		add_shortcode(
			'livestream',
			array( self::class, 'livestream' )
		);
		add_shortcode(
			'subscription_news',
			array( self::class, 'subscription_news' )
		);
		add_shortcode(
			'subscription_blog',
			array( self::class, 'subscription_blog' )
		);
	}

	public static function neon_auth() : string {
		return self::shortcode( 'neon-auth' );
	}

	public static function neon_online_store() : string {
		return self::shortcode( 'neon-online-store' );
	}

	public static function neon_account() : string {
		return self::shortcode( 'neon-account' );
	}

	public static function neon_donations() : string {
		return self::shortcode( 'neon-donations' );
	}

	public static function neon_events() : string {
		return self::shortcode( 'neon-events' );
	}

	public static function neon_cart_checkout() : string {
		return self::shortcode( 'neon-cart-checkout' );
	}

	public static function livestream() : string {
		return self::shortcode( 'livestream' );
	}

	public static function subscription_news() : string {
		return self::shortcode( 'subscription-news' );
	}

	public static function subscription_blog() : string {
		return self::shortcode( 'subscription-blog' );
	}

	protected static function shortcode( string $key ) : string {
		$handle = 'wld-the-merge-' . $key;
		if ( wp_script_is( $handle, 'registered' ) ) {
			wp_enqueue_script( $handle );
		}
		if ( wp_style_is( $handle, 'registered' ) ) {
			wp_enqueue_style( $handle );
		}

		return '<div class="' . esc_attr( $key ) . ' ' . esc_attr( $key ) . '_loading"></div>';
	}
}
