<?php

final class WLD_TM_Pages {
	public static function init()  {
		add_action(
			'wp',
			array( self::class, 'set_template_data' )
		);
		add_filter(
			'query_vars',
			static function( $query_vars ) {
				$query_vars[] = 'id';
				$query_vars[] = 'trigger';
				return $query_vars;
			}
		);
	}

	public static function admin_init() {
		add_filter(
			'display_post_states',
			array( self::class, 'set_post_states' ),
			10,
			2
		);
		add_filter(
			'rewrite_rules_array',
			array( self::class, 'set_rewrite_rules' ),
			10,
			2
		);
	}

	public static function set_template_data(): void {
		global $wp_query;

		switch ( get_query_var( 'trigger' ) ) {
			case 'product':
				$product = WLD_TM_Neon_Products_Model::get_product_by_id( get_query_var( 'id' ) );

				if ( empty( $product ) ) {
					self::set_404();
					return;
				}

				$wp_query->set( 'title', $product->title );

				add_filter(
					'wpseo_title',
					array( self::class, 'set_seo_title' )
				);

				break;
			case 'category':
				$category = WLD_TM_Neon_Products_Categories_Model::get_category_by_id( get_query_var( 'id' ) );

				if ( empty( $category ) ) {
					self::set_404();
					return;
				}

				$wp_query->set( 'title', $category->title );

				add_filter(
					'wpseo_title',
					array( self::class, 'set_seo_title' )
				);

				break;
			case 'event':
				$event = WLD_TM_Neon_Events_Model::get_event( get_query_var( 'id' )  );

				if ( empty( $event ) ) {
					self::set_404();
					return;
				}

				$wp_query->set( 'title', $event->title );

				add_filter(
					'wpseo_title',
					array( self::class, 'set_seo_title' )
				);

				break;
		}
	}

	public static function set_seo_title( string $title ) {
		return get_query_var( 'title' ) . ' - ' . $title;
	}

	public static function set_post_states( array $post_states, WP_Post $post ) : array {
		$pages = explode( ',', WLD_TM_Settings::get_pages_id( '', true ) );

		foreach ( $pages as $key => $page ) {
			$page = str_replace( array( '_post_id_sandbox', '_post_id' ), '', $page );
			self::set_post_state( $page, $key, $post_states, $post );
		}

		return $post_states;
	}

	private static function set_post_state( string $page_key, string $state, array &$post_states, WP_Post $post ) : void {
		$post_id = WLD_TM_Settings::get_page_id( $page_key );

		if ( $post_id && $post_id === $post->ID ) {
			$post_states[ sanitize_key( $state ) ] = $state;
		}
	}

	public static function set_rewrite_rules( array $rules ) : array {
		self::set_rule( 'online_store', 'product', $rules );
		self::set_rule( 'online_store', 'category', $rules );
		self::set_rule( 'events', 'event', $rules );
		self::set_rule( 'donations_page', 'donations', $rules );
		self::set_rule( 'livestream_page', 'archive', $rules );
		self::set_rule( 'thank_you_page', 'thank_you_page', $rules );
		self::set_rule( 'one_time_donation_thank_you_page', 'one_time_donation_thank_you_page', $rules );
		self::set_rule( 'recurring_donation_thank_you_page', 'recurring_donation_thank_you_page', $rules );
		self::set_rule( 'events_thank_you_page', 'events_thank_you_page', $rules );
		self::set_rule( 'subscribe_thank_you_page', 'subscribe_thank_you_page', $rules );

		return $rules;
	}

	private static function set_rule( string $page_key, string $entry, array &$rules ) : void {
		$post_id = WLD_TM_Settings::get_page_id( $page_key );

		if ( $post_id ) {
			$path  = self::get_path( $page_key );
			if ( 'archive' === $entry ) {
				$rules = array( '^' . $path . '/' . $entry . '/(.*)/?' => 'index.php?page_id=' . $post_id . '&id=$matches[1]' . '&trigger=' . $entry ) + $rules;
			}
			else {
				$rules = array( '^' . $path . '/' . $entry . '/([^/]+)/?$' => 'index.php?page_id=' . $post_id . '&id=$matches[1]' . '&trigger=' . $entry ) + $rules;
			}
		}
	}

	public static function get_path( string $page_key ) : string {
		$post_id = WLD_TM_Settings::get_page_id( $page_key );

		if ( $post_id ) {
			return trim(
				str_replace( home_url( '/' ), '', get_permalink( $post_id ) ),
				'/'
			);
		}

		return '';
	}

	public static function set_404() : void {
		global $wp_query;

		$wp_query = new WP_Query();
		$wp_query->set_404();
		status_header( 404 );
		nocache_headers();
	}

	public static function set_seo() : void {
		// todo: We need to set title and description, maybe image if it's easy.
	}
}
