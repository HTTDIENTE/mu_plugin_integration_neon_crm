<?php
/**
 * @noinspection SqlResolve, SqlNoDataSourceInspection
 *
 * phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- We cannot escape table names in SQL.
 */

final class WLD_TM_Database_Neon_Events_TMP extends WLD_TM_Database_Neon_Events {
	protected static string $name = 'tm_events_tmp';

	public static function create() : array {
		global $wpdb;

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		$name   = self::get_table_name();
		$scheme = self::$scheme;
		$sql    = "
			CREATE TABLE $name ($scheme)
			DEFAULT CHARACTER SET $wpdb->charset COLLATE $wpdb->collate;
		";

		return dbDelta( $sql );
	}

	public static function clear_table() : void {
		$table = self::get_table_name();

		global $wpdb;
		$wpdb->query(
			"DROP TABLE $table"
		);
	}

	public static function update_events_tmp() : bool {
		global $wpdb;

		$table      = self::get_table_name();
		$table_list = WLD_TM_Database_Neon_Events_List_TMP::get_table_name();

		if ( ! self::has_table( $table ) ) {
			WLD_TM_Log::log(
				'info',
				'----------------START Get Event List -------------------',
				'insert-events'
			);
			WLD_TM_Database_Neon_Events_List_TMP::update_events_list_tmp();
			WLD_TM_Log::log(
				'info',
				'----------------ENDING Get Event List -------------------',
				'insert-events'
			);

			self::create();
		}

		do {
			set_transient( 'wld_last_insert_events', '1', MINUTE_IN_SECONDS );
			$result = $wpdb->get_row(
				"
					SELECT $table_list.neon_event_id AS neon_event_id
					FROM $table_list
					LEFT OUTER JOIN $table ON $table.neon_event_id = $table_list.neon_event_id
					WHERE $table.neon_event_id IS NULL
					ORDER BY $table_list.neon_event_id
					LIMIT 1;",
				ARRAY_A
			);

			if ( $result ) {
				WLD_TM_Log::log(
					'info',
					'----------------START Inserting to tmp table ( Event: ' . $result['neon_event_id'] . ' )-------------------',
					'insert-events'
				);

				$wpdb->query(
					$wpdb->prepare(
						"DELETE FROM $table_list WHERE neon_event_id = %d",
						$result['neon_event_id'],
					),
				);

				$data  = WLD_TM_Neon_API_Events::get_event( $result['neon_event_id'] );
				$event = self::format_insert_data( $data );
				$query = array();

				WLD_TM_Log::log(
					'info',
					"-----------Event Formatted------------\n" . json_encode( $event ) ?? '',
					'insert-events'
				);

				foreach ( $event as $row ) {
					$query[] = $wpdb->prepare(
						'(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)',
						$row['title'],
						$row['neon_event_id'],
						$row['description'],
						$row['summary'],
						$row['start_date'],
						$row['end_date'],
						$row['registration_open_datetime_gmt'],
						$row['registration_close_datetime_gmt'],
						$row['price'],
						$row['category_id'],
						$row['need_register'],
						$row['need_payment'],
					);
				}
				$wpdb->query(
					$wpdb->prepare(
						"
						INSERT INTO $table (
						`title`,
						`neon_event_id`,
						`description`,
						`summary`,
						`start_datetime_gmt`,
						`end_datetime_gmt`,
						`registration_open_datetime_gmt`,
						`registration_close_datetime_gmt`,
						`price`,
						`category_id`,
						`need_register`,
						`need_payment` )
						VALUES " . implode( ',', $query )
					),
				);
				WLD_TM_Log::log(
					'info',
					'----------------ENDING Inserting to tmp table ( Event: ' . $result['neon_event_id'] . ' )-------------------',
					'insert-events'
				);
			} else {
				WLD_TM_Log::log(
					'info',
					'----------------Nothing to import, event list is empty-------------------',
					'insert-events'
				);
				return true;
			}
		}
		while ( $result );

		WLD_TM_Log::log(
			'info',
			'----------------Nothing to import, event list is empty-------------------',
			'insert-events'
		);
		return true;
	}

	public static function format_insert_data( $event ) : array {
		$limit  = 0;
		$format = 'Y-m-d H:i A';
		$events = array();

		if ( true === $event['archived'] ) {
			return array();
		}

		$price        = WLD_TM_Neon_API_Events::get_fee_by_ticket( $event['id'] )['fee'];

		$need_payment = match ( $price ) {
			0, 0.0 => false,
			default => true,
		};

		$timezones    = require 'wld-tm-neon-timezones.php';
		$timezone     = new DateTimeZone( $timezones[ $event['eventDates']['timeZone']['name'] ] );

		$start_time   = $event['eventDates']['startTime'] ?: '12:00 AM';
		$start_date   = date_create_from_format(
			$format,
			$event['eventDates']['startDate'] . ' ' . $start_time,
			$timezone
		);
		$start_date->setTimezone( new DateTimeZone( 'UTC' ) );

		$end_time   = $event['eventDates']['endTime'] ?: '11:59 PM';
		$final_date = date_create_immutable_from_format(
			$format,
			$event['eventDates']['endDate'] . ' ' . $end_time,
			$timezone
		);
		$final_date->setTimezone( new DateTimeZone( 'UTC' ) );

		$registration_open_date = null;
		if ( ! empty( $event['eventDates']['registrationOpenDate'] ) ) {
			$registration_open_date = date_create_immutable_from_format(
				'Y-m-d',
				$event['eventDates']['registrationOpenDate'],
				$timezone
			);
			$registration_open_date->setTimezone( new DateTimeZone( 'UTC' ) );
		}

		$registration_close_date = null;
		if ( ! empty( $event['eventDates']['registrationCloseDate'] ) ) {
			$registration_close_date = date_create_immutable_from_format(
				'Y-m-d',
				$event['eventDates']['registrationCloseDate'],
				$timezone
			);
			$registration_close_date->setTimezone( new DateTimeZone( 'UTC' ) );
		}

		while ( $start_date < $final_date ) {
			$end_date = date_create_immutable_from_format(
				$format,
				$start_date->format( 'Y-m-d' ) . ' ' . $end_time,
				$timezone
			);
			$end_date->setTimezone( new DateTimeZone( 'UTC' ) );

			$events[] = array(
				'neon_event_id'                   => $event['id'],
				'title'                           => $event['name'],
				'summary'                         => $event['summary'],
				'description'                     => $event['eventDescription'],
				'start_date'                      => $start_date->format( 'Y-m-d H:i:s' ),
				'end_date'                        => $end_date->format( 'Y-m-d H:i:s' ),
				'registration_open_datetime_gmt'  => $registration_open_date ? $registration_open_date->format( 'Y-m-d H:i:s' ) : 'NULL',
				'registration_close_datetime_gmt' => $registration_close_date ? $registration_close_date->format( 'Y-m-d H:i:s' ) : 'NULL',
				'price'                           => $price,
				'need_register'                   => (int) ! empty( $event['enableEventRegistrationForm'] ),
				'need_payment'                    => (int) ! empty( $need_payment ),
				'category_id'                     => $event['category']['id'] ?? 0,
			);

			$start_date->modify( '+1 day' );
		}

		return $events;
	}

	public static function get_table_name() : string {
		global $wpdb;

		return $wpdb->prefix . self::$name;
	}

	private static function has_table( string $table ) : bool {
		global $wpdb;

		return $wpdb->get_var( "SHOW TABLES LIKE '$table'" ) === $table;
	}
}
