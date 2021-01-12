const createSubscriber = require( 'pg-listen' )

// Accepts the same connection config object that the "pg" package would take
const subscriber = createSubscriber( { connectionString: 'postgresql://postgres:postgres@localhost:5432/clint' } )

subscriber.events.on( 'error', ( error ) => {
    console.error( 'Fatal database connection error:', error )
    process.exit( 1 )
} )

process.on( 'exit', () => {
    subscriber.close()
} )

async function connect() {
    await subscriber.connect()
    await subscriber.listenTo( 'aaaabbbb' )
}

async function sendSampleMessage() {
    await subscriber.notify( 'aaaabbbb', {
        greeting: 'Hey, buddy.',
        timestamp: Date.now()
    } )
}

module.exports = {
    connect: connect,
    sendSampleMessage: sendSampleMessage,
    subscriber: subscriber
}
