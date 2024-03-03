<?php
/**
 * Plugin Name: WLD The Merge
 * Text Domain: wld-the-merge
 *
 * @package WLD_TM
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

require 'includes/vendor/autoload.php';

define( 'WLD_TM_URL', plugin_dir_url( __FILE__ ) );
define( 'WLD_TM_PATH', plugin_dir_path( __FILE__ ) );

add_action(
	'plugins_loaded',
	array( 'WLD_TM_Main', 'init' ),
	0
);
