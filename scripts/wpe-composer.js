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
		console.log( 'Composer started' );
		ssh.exec(
			'cd ~/sites/wldtmdev/wp-content/mu-plugins/wld-the-merge ; composer install --no-dev --optimize-autoloader',
			( err, stream ) => {
				if ( err ) throw err;

				stream
					.on( 'close', () => {
						console.log( 'Composer ended' );
						ssh.end();
					} )
					.stderr.on( 'data', ( data ) => {
						console.error( data.toString() );
					} );
			}
		);
	} ).connect( {
		host: 'wldtmdev.ssh.wpengine.net',
		port: '22',
		username: 'wldtmdev',
		privateKey: fs.readFileSync( privateKeyPath ),
	} );
}
