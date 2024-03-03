<?php

class WLD_TM_REST_Controller extends WP_REST_Controller {
	protected static string $name    = 'neon';
	protected static string $version = 'v1';
	protected static string $base    = '';

	protected array $routes = array();

	public function __construct() {
		$this->namespace = static::$name . '/' . static::$version;
		$this->rest_base = static::$base;
	}

	public function register_routes() : void {
		if ( $this->routes ) {
			foreach ( $this->routes as $route => $endpoints ) {
				$route = is_string( $route ) ? '/' . $route : '';

				WLD_TM_Log::log(
					'info',
					'-------------Register ' . $route . ' ----------++++++++++++++--',
					'rest-api'
				);

				$permission_callback = $endpoints['permission_callback'] ?? array( static::class, 'check_permission' );
				$args                = $endpoints['args'] ?? array();

				foreach ( $endpoints as $key => $endpoint ) {
					if ( is_int( $key ) ) {
						if ( empty( $endpoint['permission_callback'] ) ) {
							$endpoints[ $key ]['permission_callback'] = $permission_callback;
						}
						if ( empty( $endpoints['args'] ) ) {
							$endpoints['args'] = array();
						}

						$endpoints[ $key ]['args'] = array_merge( $args, $endpoints['args'] );
					}
				}

				unset( $endpoints['args'], $endpoints['permission_callback'] );

				WLD_TM_Log::log(
					'info',
					'-------------Register ' . $route . ' complete ------------',
					'rest-api'
				);

				register_rest_route(
					$this->namespace,
					'/' . $this->rest_base . $route,
					$endpoints
				);
			}
		}
	}

	public function get_namespace() : string {
		return $this->namespace;
	}

	public static function get_name() : string {
		return static::$name;
	}

	public static function get_base() : string {
		return static::$base;
	}

	public static function check_permission( WP_REST_Request $request ) : bool {
		return true;
	}

	public static function check_authentication( WP_REST_Request $request ) : bool {
		$token = WLD_TM_Database_Neon_Auth::get_account_id_by_authorization( $request->get_headers() );

		if ( empty( $token ) ) {
			return false;
		}

		return true;
	}
}
