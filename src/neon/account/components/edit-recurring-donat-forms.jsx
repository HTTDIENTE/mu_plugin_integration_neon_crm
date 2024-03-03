import { EditRecurringDonatAmountForm } from './edit-recurring-donat-amount-form';
import { EditRecurringDonatPaymentForm } from './edit-recurring-donat-payment-form';

export function EditRecurringDonatForms( { donat, messageApi } ) {
	return (
		<div className="recurring-donat__forms">
			<EditRecurringDonatAmountForm
				donat={ donat }
				messageApi={ messageApi }
			/>
			<EditRecurringDonatPaymentForm
				donat={ donat }
				messageApi={ messageApi }
			/>
		</div>
	);
}
