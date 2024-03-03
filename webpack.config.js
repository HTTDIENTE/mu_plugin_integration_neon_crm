// noinspection JSCheckFunctionSignatures

/**
 * Disable ReactRefreshWebpackPlugin, as it breaks the hot reload.
 * Add HtmlWebpackPlugin, to create an index file.
 * Enabling runtimeChunk single, because without it hot reload does not work.
 */

const { basename, extname, join } = require( 'path' );
const { existsSync, readFileSync } = require( 'fs' );
const { sync } = require( 'glob' );
const { createProxyMiddleware } = require( 'http-proxy-middleware' );
const yaml = require( 'js-yaml' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const HtmlWebpackPlugin = require( 'html-webpack-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const webpack = require( 'webpack' );
const entryFiles = sync( 'src/*.jsx', { absolute: true } );
const entry = {};
const appConfig = yaml.load( readFileSync( 'config.yml', 'utf8' ) );
const proxy = appConfig[ appConfig.proxy ];
const protocol = 'local' === appConfig.proxy ? 'http' : 'https';
const isProduction = 'production' === process.env.NODE_ENV;
const isWriteFiles = 'wprun' === process.env.npm_lifecycle_event;

function getProxyErrorFile( endpoint ) {
	const _appConfig = yaml.load( readFileSync( 'config.yml', 'utf8' ) );
	const _proxy = _appConfig[ appConfig.proxy ];

	return _proxy.errors ? _proxy.errors[ endpoint ] : null;
}

entryFiles.forEach( ( entryFile ) => {
	entry[ basename( entryFile, '.jsx' ) ] = entryFile;
} );

const config = {
	...defaultConfig,
	entry,
	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules.map( ( rule ) => {
				if ( Array.isArray( rule.use ) ) {
					rule.use = rule.use.map( ( use ) => {
						if ( Array.isArray( use?.options?.plugins ) ) {
							use.options.plugins = use.options.plugins.filter(
								( plugin ) =>
									! plugin.includes( 'react-refresh' )
							);
						}

						return use;
					} );
				}

				return rule;
			} ),
		],
	},
	plugins: [
		...defaultConfig.plugins.filter(
			( plugin ) => plugin.constructor.name !== 'ReactRefreshPlugin'
		),
		new webpack.ContextReplacementPlugin( /moment[/\\]locale$/, /en-gb/ ),
	],
	optimization: {
		...defaultConfig.optimization,
		runtimeChunk: 'single',
	},
};

if ( ! isProduction ) {
	config.plugins.push(
		new HtmlWebpackPlugin( {
			template: 'src/global/index.html',
			base: '/',
		} )
	);
	config.plugins.push(
		new CopyPlugin( {
			patterns: [
				{
					from: 'data/**/*',
				},
			],
		} )
	);

	// noinspection JSUnusedGlobalSymbols
	config.devServer = {
		...defaultConfig.devServer,
		host: appConfig.local.host,
		port: appConfig.local.port,
		server: protocol,
		headers: {
			...defaultConfig.devServer.headers,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods':
				'GET, POST, DELETE, PUT, PATCH, OPTIONS',
			'Access-Control-Allow-Headers':
				'Content-Type, api_key, Authorization',
		},
		devMiddleware: {
			...defaultConfig.devServer.devMiddleware,
			writeToDisk: isWriteFiles,
		},
		historyApiFallback: {
			rewrites: [
				{ from: /product\/\d+$/, to: '/index.html' },
				{ from: /event\/\d+$/, to: '/index.html' },
			],
		},
		allowedHosts: 'all',
		setupMiddlewares: ( middlewares, devServer ) => {
			if ( ! devServer ) {
				throw new Error( 'webpack-dev-server is not defined' );
			}

			let apiMiddleware;

			if ( 'local' !== appConfig.proxy ) {
				apiMiddleware = createProxyMiddleware( {
					target: `${ protocol }://${ proxy.host }`,
					secure: false,
					changeOrigin: true,
					async pathRewrite( path ) {
						return `/wp-json${ path }`;
					},
				} );
			} else {
				apiMiddleware = createProxyMiddleware( {
					target: `${ protocol }://${ proxy.host }:${ proxy.port }`,
					secure: false,
					async pathRewrite( path, request ) {
						const url = new URL(
							request.url,
							`${ protocol }://${ request.headers.host }`
						);

						const method =
							request.headers[ 'x-http-method-override' ] ||
							request.method;

						const endpoint = `${ url.pathname.replace(
							/^\/|\/$/g,
							''
						) }/${ method }`;

						const file =
							getProxyErrorFile( endpoint ) || 'index.json';

						return `/data/${ endpoint }/${ file }`;
					},
					onProxyRes: ( proxyRes, request ) => {
						if ( '.json' === extname( request.url ) ) {
							const path = join( __dirname, request.url );
							if ( existsSync( path ) ) {
								const json = require( path );
								if ( json?.data?.status ) {
									proxyRes.statusCode = json.data.status;
								}
							}
						}
					},
					onProxyReq( proxyReq ) {
						// Convert all api requests (POST/PUT/DELETE) to GET
						// So they work in webpack dev server for testing
						proxyReq.method = 'GET';
					},
				} );
			}

			middlewares.push( {
				path: '/neon/',
				middleware: apiMiddleware,
			} );

			middlewares.push( {
				path: '/livestream/',
				middleware: apiMiddleware,
			} );

			return middlewares;
		},
	};
} else {
	// Reduces code nicely but doesn't work in WordPress :(
	// config.optimization.splitChunks.chunks = 'all';
}

module.exports = config;
