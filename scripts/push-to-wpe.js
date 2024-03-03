/* eslint-disable no-console */
const sftpClient = require( 'ssh2-sftp-client' );
const path = require( 'path' );
const yaml = require( 'js-yaml' );
const fs = require( 'fs' );
const config = yaml.load(
	fs.readFileSync( '.config.yml', { encoding: 'utf8' } )
);
const directory = '/build';
const sftp = new sftpClient();

sftp.connect( {
	host: 'wldtmdev.sftp.wpengine.com',
	port: '2222',
	username: config.sftp.username,
	password: config.sftp.password,
} )
	.then( () => {
		return sftp.exists( directory );
	} )
	.then( ( data ) => {
		if ( 'd' === data ) {
			console.info( 'Deleting files' );
			return sftp.rmdir( directory, true );
		}

		return true;
	} )
	.then( () => {
		console.info( 'Start copying files' );
		return sftp.uploadDir(
			path.join( __dirname, '../', directory ),
			directory,
			{
				useFastput: true,
			}
		);
	} )
	.then( () => {
		console.info( 'Finish copying files' );
		return sftp.end();
	} )
	.catch( ( err ) => {
		console.error( 'Error: ', err );
	} );
