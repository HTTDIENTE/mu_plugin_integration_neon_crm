import { Form, Input, Select } from 'antd';
import { validateMessages } from '../../../global/scripts/forms/values-config';
import { useContext, useEffect, useState } from '@wordpress/element';
import { EditRecurringDonationContext } from '../../../global/contexts/edit-recurring-donation-context';
import { Submit } from '../../../global/components/forms/fields/submit';
import { FormItemFloatLabel } from '../../../global/components/forms/fields/form-item-float-label';
import moment, { parseZone } from 'moment/moment';
import {
	setDate,
	setRecurringDonations,
} from '../../../global/scripts/storage';
import { apiNeon } from '../../../global/scripts/api';
import Preloader from '../../../global/components/preloader';

function formatDataRecurringDonat( values, donat ) {
	return {
		id: donat.id,
		recurringPeriod: 1,
		recurringPeriodType: values.frequency.toUpperCase(),
		amount: +values.amount,
		nextDate: moment().add( 1, 'days' ).utc().format(),
	};
}

export function EditRecurringDonatAmountForm( { donat, messageApi } ) {
	const [ preloader, setPreloader ] = useState( false );
	const { setEditRecurringDonationId } = useContext(
		EditRecurringDonationContext
	);

	const [ form ] = Form.useForm();
	const [ amount, setAmount ] = useState( donat.amount );

	const handleClickChangeAmount = ( event ) => {
		setAmount( event.target.value );
	};

	useEffect( () => {
		form.setFieldValue( [ 'amount' ], amount );
	}, [ amount ] );

	const onSubmit = async ( values ) => {
		setPreloader( true );

		try {
			const response = await apiNeon(
				'account/recurring-donations',
				formatDataRecurringDonat( values, donat ),
				'PATCH'
			);
			setEditRecurringDonationId( '' );
			setRecurringDonations( response.data.recurringDonations );
			setDate( 'recurringDonations' );
			setPreloader( false );
			messageApi.open( { type: 'success', content: 'Success!' } );
		} catch ( error ) {
			setPreloader( false );
			messageApi.open( { type: 'error', error: error.message } );
		}
	};

	return (
		<>
			{ preloader && <Preloader /> }
			<Form
				form={ form }
				onFinish={ ( values ) => onSubmit( values ) }
				initialValues={ donat }
				validateMessages={ validateMessages }
				className="recurring-donat__forms_edit-amount"
				autoComplete="off"
				scrollToFirstError
			>
				<h3 className="recurring-donat__form-title">
					Edit Donation Amount
				</h3>
				<Form.Item>
					<button
						className="recurring-donat__amount-btn"
						type="button"
						value="25"
						onClick={ handleClickChangeAmount }
					>
						$ 25
					</button>
					<button
						className="recurring-donat__amount-btn"
						type="button"
						value="100"
						onClick={ handleClickChangeAmount }
					>
						$ 100
					</button>
					<button
						className="recurring-donat__amount-btn"
						type="button"
						value="250"
						onClick={ handleClickChangeAmount }
					>
						$ 250
					</button>
					<button
						className="recurring-donat__amount-btn"
						type="button"
						value="500"
						onClick={ handleClickChangeAmount }
					>
						$ 500
					</button>
				</Form.Item>

				<FormItemFloatLabel
					name={ [ 'amount' ] }
					label="Amount"
					alwaysUsed={ true }
					rules={ [
						{
							required: true,
							message: 'Enter amount please',
						},
						{
							validator( _, value ) {
								if ( ! value || '0' !== value ) {
									return Promise.resolve();
								}
								return Promise.reject(
									new Error( 'Amount must be greater than 0' )
								);
							},
						},
					] }
				>
					<Input value={ amount } />
				</FormItemFloatLabel>

				<FormItemFloatLabel
					name={ [ 'nextDate' ] }
					label="Edit Order Date"
					alwaysUsed={ true }
					normalize={ ( value ) => {
						return new Date( value ).toISOString();
					} }
					getValueProps={ ( value ) => {
						if ( value ) {
							return {
								value: parseZone( value )
									.local()
									.format( 'YYYY-MM-DD' ),
							};
						}
						return {
							value: undefined,
						};
					} }
				>
					<Input type="date" />
				</FormItemFloatLabel>

				<FormItemFloatLabel
					name={ [ 'frequency' ] }
					label="Edit Frequency"
				>
					<Select>
						<Select.Option value="week">Weekly</Select.Option>
						<Select.Option value="month">Monthly</Select.Option>
					</Select>
				</FormItemFloatLabel>

				<Form.Item name={ [ 'id' ] } noStyle>
					<Input type="hidden" />
				</Form.Item>

				<Submit />
			</Form>
		</>
	);
}
