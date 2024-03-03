<?php

final class WLD_TM_Utils {
	public static function is_rest() : bool {
		return str_starts_with( $_SERVER['REQUEST_URI'], '/wp-json/' );
	}
}
