const createError = require( 'http-errors' )
const express = require( 'express' )
const path = require( 'path' )
const cookieParser = require( 'cookie-parser' )
const pgs = require( './postgres' )
const postgres = require( './postgres-client' )
const logger = require( 'morgan' )

const app = express()
app.set( 'port', process.env.PORT || 3100 )
pgs.connect()
const expressWs = require( 'express-ws' )( app )
app.ws( '/socket', function( ws, req ) {
    ws.on( 'message', function( msg ) {
        console.log( 'before update ' + msg )
        const msgObj = JSON.parse( msg )
        if ( msgObj.type !== undefined && msgObj.type === 'update' ) {
            console.log( 'line 20' )
            postgres.updatePostgres( msgObj.currState )
        }

        ws.send( msg )
    } )

    pgs.subscriber.notifications.on( 'aaaabbbb', ( payload ) => {
        // ws.send('5:1::{"name":"newimg", "args":"bla"}')

        ws.send( JSON.stringify( payload ) )
        console.log( "Received notification in 'aaaabbbb':", payload )
    } )
} )
app.listen( 3001 )
// view engine setup
app.set( 'views', path.join( __dirname, 'views' ) )
app.set( 'view engine', 'jade' )

app.use( logger( 'dev' ) )
app.use( express.json() )
app.use( express.urlencoded( { extended: false } ) )
app.use( cookieParser() )
app.use( express.static( path.join( __dirname, 'public' ) ) )

// catch 404 and forward to error handler
app.use( function( req, res, next ) {
    next( createError( 404 ) )
} )

// error handler
app.use( function( err, req, res, next ) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get( 'env' ) === 'development' ? err : {}

    // render the error page
    res.status( err.status || 500 )
    res.render( 'error' )
} )

module.exports = app
