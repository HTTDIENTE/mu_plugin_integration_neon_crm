/* eslint-disable no-console */
const { Client: sshClient } = require( 'ssh2' );
const fs = require( 'fs' );
const yaml = require( 'js-yaml' );
const config = yaml.load(
	fs.readFileSync( '.config.yml', { encoding: 'utf8' } )
);

// noinspection JSUnresolvedVariable
const privateKeyPath = config?.ssh?.privateKeyPath;

if ( privateKeyPath ) {
	const ssh = new sshClient();

	ssh.on( 'ready', () => {
		console.log( 'Cache flush started' );

		ssh.exec( 'wp cache flush', ( err, stream ) => {
			if ( err ) throw err;

			stream
				.on( 'close', () => {
					ssh.end();
				} )
				.on( 'data', ( data ) => {
					console.log( data );
				} )
				.stderr.on( 'data', ( data ) => {
					console.error( 'Error: ', data );
				} );
		} );
	} ).connect( {
		host: 'wldtmdev.ssh.wpengine.net',
		port: '22',
		username: 'wldtmdev',
		privateKey: fs.readFileSync( privateKeyPath ),
	} );
}
