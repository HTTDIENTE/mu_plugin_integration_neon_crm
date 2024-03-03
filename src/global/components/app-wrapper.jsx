import { StyleProvider } from '@ant-design/cssinjs';
import { StrictMode } from '@wordpress/element';
import { ConfigProvider } from 'antd';

export function AppWrapper( { children } ) {
	return (
		<StrictMode>
			<StyleProvider hashPriority="high">
				<ConfigProvider
					theme={ {
						token: {
							borderRadius: 0,
						},
					} }
				>
					{ children }
				</ConfigProvider>
			</StyleProvider>
		</StrictMode>
	);
}
