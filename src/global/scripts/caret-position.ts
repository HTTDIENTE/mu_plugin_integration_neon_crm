import { CaretPosition } from '../types';

const elements: Map< HTMLInputElement, CaretPosition > = new Map();

export function get(
	inputOrTextarea: HTMLInputElement,
	fixStart: number = 0,
	fixEnd: number = 0
): CaretPosition {
	return {
		start: inputOrTextarea.selectionStart + fixStart,
		end: inputOrTextarea.selectionEnd + fixEnd,
	};
}

export function set(
	inputOrTextarea: HTMLInputElement,
	caretPosition: CaretPosition
) {
	inputOrTextarea.setSelectionRange( caretPosition.start, caretPosition.end );
}

export function save(
	inputOrTextarea: HTMLInputElement,
	fixStart: number = 0,
	fixEnd: number = 0
) {
	elements.set( inputOrTextarea, get( inputOrTextarea, fixStart, fixEnd ) );
}

export function restore( inputOrTextarea: HTMLInputElement ) {
	const caretPosition = elements.get( inputOrTextarea );
	if ( caretPosition ) {
		set( inputOrTextarea, caretPosition );
		elements.delete( inputOrTextarea );
	}
}
