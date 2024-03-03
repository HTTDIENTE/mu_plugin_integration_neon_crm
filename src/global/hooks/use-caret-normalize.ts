import { useEffect, useRef } from '@wordpress/element';
import { Form } from 'antd';
import { get, restore, save } from '../scripts/caret-position';

export function useCaretNormalize( name ) {
	const input = useRef( null );
	const phoneValue = Form.useWatch( name, Form.useFormInstance() );
	useEffect( () => {
		if ( input.current.input ) {
			/* Restoring the caret position after formatting. */
			restore( input.current.input );
		}
	}, [ phoneValue ] );

	return [
		input,
		( value, newValue ) => {
			/* Save the caret position before formatting. */
			if ( newValue !== value ) {
				const currentPositions = get( input.current.input );

				let fix = newValue.length - value.length;
				if ( ' ' === newValue[ currentPositions.end ] ) {
					fix -= 1;
				}

				save( input.current.input, fix, fix );
			}

			return newValue;
		},
	];
}
