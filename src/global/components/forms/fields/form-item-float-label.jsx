import { Form } from 'antd';
import classNames from 'classnames';
import { useContext, useState } from '@wordpress/element';
import isEmpty from 'lodash/isEmpty';
import { FormListPathContext } from '../../../contexts/form-list-path-context';
import( '../../../styles/float-label.scss' );

export function FormItemFloatLabel( {
	name,
	className,
	onFocus,
	onBlur,
	alwaysUsed,
	form,
	...props
} ) {
	let namePath = name;

	// Here we define that this component is nested in Form.List.
	// Unfortunately I couldn't find how I can get the parent path.
	// Therefore, for now, we must hand it over.
	const formListPath = useContext( FormListPathContext );
	if ( formListPath && name ) {
		namePath = [ ...formListPath, ...name ];
	}

	const value = Form.useWatch( namePath, form || null );
	const [ focus, setFocus ] = useState( false );

	return (
		<Form.Item
			{ ...props }
			name={ name }
			className={ classNames( className, {
				'float-label': true,
				'float-label_used': ! isEmpty( value ) || focus || alwaysUsed,
				'float-label_unused':
					isEmpty( value ) && ! focus && ! alwaysUsed,
			} ) }
			onFocus={ ( event ) => {
				if ( onFocus ) {
					onFocus( event );
				}
				setFocus( true );
			} }
			onBlur={ ( event ) => {
				if ( onBlur ) {
					onBlur( event );
				}
				setFocus( false );
			} }
		/>
	);
}
