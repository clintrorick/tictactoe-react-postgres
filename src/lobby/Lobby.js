// import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import PropTypes from 'prop-types'
import { React, useEffect, useState } from 'react'
import LoggedInUser from '../header/LoggedInUser'
import './Lobby.css'
import { CSSTransitionGroup } from 'react-transition-group' // ES6
import Title from 'header/Title'

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

    function amIinThisGame( game ) {
        const currUid = firebase.auth().currentUser.uid
        return game.game_host === currUid
            || game.challenger === currUid
    }

    function isGameFull( game ) {
        return game.game_host !== null
            && game.challenger !== null
    }

    async function leaveGame() {

    }

    async function joinGame( game ) {
        const currentUser = firebase.auth().currentUser
        try {
            if ( game.game_host !== currentUser.uid ) {
                await firebase.firestore().collection( 'games' )
                    .doc( game.id )
                    .set(
                        {
                            challenger: currentUser.uid,
                            // anonymous users don't have display names
                            challenger_name: currentUser.isAnonymous
                        ? currentUser.uid.substr( 0, 4 )
                        : currentUser.displayName
                        },
                        {
                            merge: true
                        }
                    )
            }
            props.history.push( '/games/' + game.id )
        } catch ( error ) {
            console.log( error )
        }
    }

    useEffect( () => {
        firebase.firestore().collection( 'games' )
            .orderBy( 'created_ts', 'desc' )
            .onSnapshot( ( querySnapshot ) => {
                // ignore updates from ourselves to ourselves - wait on the server to validate the update based on rules
                if ( querySnapshot.metadata.hasPendingWrites === false ) {
                    const gameObjs = querySnapshot.docs
                        .map( ( doc ) => {
                            console.log( doc.data() )
                            return Object.assign( { id: doc.id }, doc.data() )
                        } )
                        .filter( ( game ) =>
                            game.created_ts !== null
                        ).sort( ( game1, game2 ) => {
                            if ( amIinThisGame( game1 ) && amIinThisGame( game2 ) ) {
                                return game1.created_ts > game2.created_ts ? -1 : 1
                            } else {
                                return amIinThisGame( game1 ) ? -1 : 1
                            }
                        }
                            // if in both games, check created_ts
                        )

                    updateGames( gameObjs )
                }
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
                challenger: null,
                created_ts: firebase.firestore.FieldValue.serverTimestamp(),
                activePlayer: gameHost
            } )
            .then( ( game ) => {
                props.history.push( '/games/' + game.id )
            } )
    }
    // TODO cleanup this giant block of jsx
    return <div>
        <div className="container">
            <div className="row row-center" >
                <Title/>
            </div>
            <div className="row row-center" >
                <LoggedInUser/>
            </div>
        </div>

        <div className="container">
            <div className="row row-center" >
                <button className="button-normal" onClick={ () => createGame() }>Host New Game</button>
            </div>
        </div>
        <div className="container">
            <CSSTransitionGroup
                transitionName="newgamepopuplobby"
                transitionEnterTimeout={2000}
                transitionLeaveTimeout={2000}>
                {games.map( ( game ) =>
                    <div className="game-container" key={ game.id }>
                        <div className="container">
                            <div className="row row-center" >
                                <div className="column column-players">
                                    <span><strong>Host: </strong>{game.game_host_name ?? 'Unknown User'}</span>
                                    { game.challenger != null
                                        ? <span className="challenger">
                                            <strong>Challenger: </strong>
                                            { game.challenger_name ?? 'Unknown User'}
                                        </span>
                                        : <span/>
                                    }
                                </div>

                                <div className="column"> { relativeTime( game ) } </div>
                            </div>
                        </div>
                        <div className="container">
                            <div className="row row-center" >
                                <button className="button-outline"
                                    disabled={isGameFull( game ) && !amIinThisGame( game )}
                                    onClick={() => { joinGame( game ) }}>
                                    { amIinThisGame( game )
                                        ? <span>Rejoin Game</span>
                                        : ( isGameFull( game )
                                                ? <span>Game Full</span>
                                                : <span>Join Game</span> ) }
                                </button>
                            </div>
                            { amIinThisGame( game )
                            ? <div className="row row-bottom" >
                                <button className="button-cancel button-leave"
                                    onClick={() => { leaveGame( game ) }}>
                                        Drop
                                </button>
                            </div>
                            : <div className="row row-bottom"></div>}
                        </div>
                    </div> )
                }
            </CSSTransitionGroup>

        </div>
        <div className="container">
            <div className="row row-center" >
                <div className="column column-50">
                    <button className="button-cancel" onClick={
                        () => {
                            firebase.auth().signOut().then(
                                () => props.history.push( '/signin' ) )
                        }}>Sign Out</button>
                </div>
            </div>
        </div>
    </div>
}

export default Lobby
