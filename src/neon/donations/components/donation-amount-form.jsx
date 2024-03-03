import { Form, Input, Radio, Select, Space } from 'antd';
import { validateMessages } from '../../../global/scripts/forms/values-config';
import { useEffect } from '@wordpress/element';
import { FormItemFloatLabel } from '../../../global/components/forms/fields/form-item-float-label';

export function DonationAmountForm( { donationData, setDonationData, amountForm } ) {
	const handlerChangeAmount = ( event ) => {
		setDonationData( { ...donationData, amount: event.target.value } );
	};

	const handlerChangeType = ( event ) => {
		const type = event.target.value;
		const frequency =
			type === 'one-time'
				? ''
				: amountForm.getFieldValue( [ 'donation', 'frequency' ] );
		setDonationData( { ...donationData, type, frequency } );
	};

	const handlerChangeFrequency = ( value ) => {
		setDonationData( {
			...donationData,
			frequency: value,
			type: 'recurring',
		} );
	};

	useEffect( () => {
		amountForm.setFieldValue( [ 'donation', 'amount' ], donationData.amount );
	}, [ donationData.amount ] );

	return (
		<Form
			form={ amountForm }
			initialValues={ { donation: { frequency: 'week' } } }
			className="donation__amount-form"
			validateMessages={ validateMessages }
		>
			<h3 className="donation__form-title">Donation Amount</h3>

			<Form.Item>
				<button
					className="donation__amount-btn"
					type="button"
					value="25"
					onClick={ handlerChangeAmount }
				>
					$ 25
				</button>
				<button
					className="donation__amount-btn"
					type="button"
					value="100"
					onClick={ handlerChangeAmount }
				>
					$ 100
				</button>
				<button
					className="donation__amount-btn"
					type="button"
					value="250"
					onClick={ handlerChangeAmount }
				>
					$ 250
				</button>
				<button
					className="donation__amount-btn"
					type="button"
					value="500"
					onClick={ handlerChangeAmount }
				>
					$ 500
				</button>
			</Form.Item>

			<FormItemFloatLabel
				name={ [ 'donation', 'amount' ] }
				label="Amount"
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
				<Input
					value={ donationData.amount }
					onChange={ handlerChangeAmount }
				/>
			</FormItemFloatLabel>

			<h3 className="donation__form-title">Giving Type</h3>

			<Form.Item
				name="donation-type"
				rules={ [ { required: true, message: 'Please select a frequency option!' } ] }
			>
				<Radio.Group
					onChange={ handlerChangeType }
					value={ donationData.type }
				>
					<Space
						className={
							donationData.type === 'one-time' ? 'active' : null
						}
					>
						<Radio value="one-time">One time donation</Radio>
					</Space>
					<Space
						direction="vertical"
						className={
							donationData.type === 'recurring' ? 'active' : null
						}
					>
						<Radio value="recurring">Recurring donation</Radio>

						<FormItemFloatLabel
							name={ [ 'donation', 'frequency' ] }
							label="Frequency"
						>
							<Select onChange={ handlerChangeFrequency }>
								<Select.Option value="week">Weekly</Select.Option>
								<Select.Option value="month">Monthly</Select.Option>
							</Select>
						</FormItemFloatLabel>
					</Space>
				</Radio.Group>
			</Form.Item>
		</Form>
	);
}
