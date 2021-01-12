const { Client } = require( 'pg' )

const connectionString = 'postgresql://postgres:postgres@localhost:5432/clint'

async function updatePostgres( currState ) {
    // TODO pooling
    const client = new Client( {
        connectionString
    } )
    await client.connect()
    console.log( currState )
    await client.query( 'INSERT into tictactoe.gridstate(grid, game_id) VALUES (\'' + currState + '\',\'aaaabbbb\')' )
    await client.end()
}

module.exports = { updatePostgres: updatePostgres }
