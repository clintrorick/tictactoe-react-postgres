const firebase = require( '@firebase/rules-unit-testing' )
const test = require( 'baretest' )( 'Firestore rules tests' )
const assert = require( 'assert' )

// const firestore = firebase.initializeTestApp( {
//     projectId: 'firestore-test-project',
//     auth: { uid: 'rando', email: 'rando@rando.com' }
// } ).firestore()

// async function load() {
//     const rules = fs.readFileSync( 'firestore.rules', 'utf8' )
//     await firebase.loadFirestoreRules( { projectId: 'firestore-test-project', rules } )
// }

// firebase.loadFirestoreRules( {
//     projectId: 'firestore-test-project',
//     rules: fs.readFileSync( './firestore.rules' )
// } )

const RANDO_USER_AUTH = { uid: 'rando' }
const DEFAULT_GAME_OBJECT = {
    game_host: 'clint',
    game_host_name: 'clint rorick',
    challenger: null,
    created_ts: firebase.firestore.FieldValue.serverTimestamp()
}

const DEFAULT_GAMESTATE_OBJECT = {
    gridstate: 'eeeeeeeee',
    created_ts: firebase.firestore.FieldValue.serverTimestamp()
}
const TEST_PROJECT_ID = 'firestore-test-project'

function firestoreWithAuth( auth ) {
    return firebase
        .initializeTestApp( { projectId: TEST_PROJECT_ID, auth: auth } )
        .firestore()
}

// test.before( async() => {
//     await firebase.clearFirestoreData( { projectId: TEST_PROJECT_ID } )
// } )

test( 'create game SHOULD work for logged in user', async function() {
    const createdGame = await firestoreWithAuth( RANDO_USER_AUTH )
        .collection( 'games' )
        .add( DEFAULT_GAME_OBJECT )
    assert( createdGame.id !== null )
} )

test( 'SHOULD NOT successfully create game for user with no auth', async function() {
    try {
        await firestoreWithAuth( null )
            .collection( 'games' )
            .add( DEFAULT_GAME_OBJECT )
    } catch ( error ) {
        assert( error.code === 'permission-denied' )
        return
    }
    assert.fail()
} )

test( 'SHOULD NOT be able to modify gamestate if user is not host or challenger of game', async function() {
    const createdGame = await firestoreWithAuth( RANDO_USER_AUTH )
        .collection( 'games' )
        .add( DEFAULT_GAME_OBJECT )

    try {
        await firestoreWithAuth( RANDO_USER_AUTH )
            .collection( 'games/' + createdGame.id + '/gamestates' )
            .add( { DEFAULT_GAMESTATE_OBJECT } )
    } catch ( error ) {
        assert( error !== null )
        return
    }
    assert.fail()
} )

test( 'SHOULD be able to modify gamestate if user is host or challenger of game', async function() {
    const createdGame = await firestoreWithAuth( RANDO_USER_AUTH )
        .collection( 'games' )
        .add( Object.assign( DEFAULT_GAME_OBJECT, { game_host: 'rando' } ) )

    const createdGamestate = await firestoreWithAuth( RANDO_USER_AUTH )
        .collection( 'games/' + createdGame.id + '/gamestates' )
        .add( { DEFAULT_GAMESTATE_OBJECT } )

    assert( createdGamestate.id != null )
} )

!( async() => {
    await test.run()
    process.exit()
} )()
