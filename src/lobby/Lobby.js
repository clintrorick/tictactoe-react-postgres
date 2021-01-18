import { React, useState, useEffect } from 'react'
// import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import PropTypes from 'prop-types'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend( relativeTime )
function Lobby( props ) {
    Lobby.propTypes = {
        history: PropTypes.object
    }
    const [ games, updateGames ] = useState( [] )

    function relativeTime( game ) {
        const relativeTimeStr = dayjs.unix( game.created_ts.seconds ).fromNow()
        return relativeTimeStr === 'in a few seconds' || relativeTimeStr === 'a few seconds ago'
                                    ? 'just now'
                                    : relativeTimeStr
    }

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
                            ?? 'User ' + firebase.auth().currentUser.uid.substr( 0, 4 )
        firebase.firestore().collection( 'games' )
            .add( {
                game_host: gameHost,
                game_host_name: gameHostName,
                game_passenger: null,
                created_ts: firebase.firestore.FieldValue.serverTimestamp()
            } )
    }

    return <div>
        <div className="container">
            <div className="row row-center" ><h1>Naughts and Crosses</h1></div>

        </div>
        <div className="container">
            <div className="row row-center" >
                <button className="button-normal" onClick={ () => createGame() }>Host New Game</button>
            </div>
        </div>
        <div className="container">

            {games.map( ( game ) =>
                <div key={ game.id }>
                    <div className="container">
                        <div className="row row-center" >
                            <div className="column"><strong>Host: </strong>{game.game_host_name ?? 'Unknown User'}</div>
                            <div className="column"> { relativeTime( game ) } </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row row-center" >
                            <button className="button-outline"
                                onClick={() => { props.history.push( '/games/' + game.id ) }}>Join Game</button>
                        </div>
                    </div>
                </div> )
            }

        </div>
        <div className="container">
            <div className="row row-center" >
                <div className="column column-50">
                    <button className="button-cancel" onClick={() => firebase.auth().signOut()}>Sign Out</button>
                </div>
            </div>
        </div>
    </div>
}

export default Lobby
