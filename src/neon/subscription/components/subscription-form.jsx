import { Form, message } from 'antd';
import { validateMessages } from '../../../global/scripts/forms/values-config';
import { useState } from '@wordpress/element';
import { Email } from '../../../global/components/forms/fields/email';
import { Submit } from '../../../global/components/forms/fields/submit';
import { useAccount } from '../../../global/hooks/use-account';
import { apiNeon } from '../../../global/scripts/api';
import { ShowErrors } from '../../../global/scripts/actions/show-errors';
import Preloader from '../../../global/components/preloader';

export function SubscriptionForm( { subscriptionFor } ) {
	const [ form ] = Form.useForm();
	const [ account ] = useAccount();
	const [ preloader, setPreloader ] = useState( false );
	const [ messageApi, contextHolder ] = message.useMessage();
	const subscriptionId = subscriptionFor === 'Blog'
		? window.neon.subscriptionBlogId
		: window.neon.subscriptionNewsLatterId;

	const onSubmit = async ( values ) => {
		setPreloader( true );

		const data = {
			subscription: values.subscription,
			'subscriber.email1': values.primaryContact.email1,
		};

		try {
			const response = await apiNeon( 'audience', data, 'POST' );
			messageApi.open( { type: 'success', content: response.message, duration: 5 } );
			setPreloader( false );
		} catch ( error ) {
			ShowErrors( error, messageApi );
			setPreloader( false );
		}
	};

	return (
		<>
			{ preloader && <Preloader /> }
			{ contextHolder }
			<div className="subscription">
				<h2 className="subscription__title">{ `${ subscriptionFor } Subscription` }</h2>
				<Form
					name={ `subscription-${ subscriptionFor }-form` }
					form={ form }
					initialValues={ account }
					onFinish={ ( values ) => onSubmit( values ) }
					validateMessages={ validateMessages }
					autoComplete="off"
				>
					<Email />
					<Form.Item
						name={ [ 'subscription' ] }
						initialValue={ subscriptionId }
						style={ { display: 'none' } }
					>
						<input type="text" />
					</Form.Item>
					<Submit buttonTitle="Subscription" />
				</Form>
			</div>
		</>
	);
}
