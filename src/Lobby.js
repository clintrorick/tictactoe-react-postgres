import { React, useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

import { Link } from 'react-router-dom'

function Lobby( props ) {
    // Lobby.propTypes = {
    //     db: PropTypes.object
    // }
    const [ games, updateGames ] = useState( [] )

    useEffect( () => {
        firebase.firestore().collection( 'games' )
            .orderBy( 'created_ts', 'desc' )
            .onSnapshot( ( querySnapshot ) => {
                const gameObjs = querySnapshot.docs
                    .map( ( doc ) => {
                        console.log( doc.data() )

                        return Object.assign( { id: doc.id }, doc.data() )
                    } )
                    .filter( ( doc ) =>
                        doc.created_ts !== null
                    )

                updateGames( gameObjs )
            } )
    }, [ ] )

    const createGame = () => {
        const gameHost = firebase.auth().currentUser.uid
        const gameHostName = firebase.auth().currentUser.displayName
                            ?? 'Anonymous User ' + firebase.auth().currentUser.uid.substr( 0, 4 )
        firebase.firestore().collection( 'games' )
            .add( {
                game_host: gameHost,
                game_host_name: gameHostName,
                game_passenger: null,
                created_ts: firebase.firestore.FieldValue.serverTimestamp()
            } )
    }

    return <div>
        <div>
            <button onClick={ () => createGame() }>Host New Game</button>
            <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
        </div>
        <div>
            {
                games.map( ( game ) =>
                    <div key={ game.id }>
                        <div>Game ID: {game.id}</div>
                        <div>Host: {game.game_host_name ?? 'Unknown User'}</div>
                        <div>Created At: {dayjs.unix( game.created_ts.seconds ).format()}</div>
                        <Link to={'/games/' + game.id}>Join Game</Link>
                        <hr/>
                    </div> )
            }
        </div>
    </div>
}

export default Lobby
