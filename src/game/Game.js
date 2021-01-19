import { RectClickable } from './RectClickable'
import PropTypes from 'prop-types'
import { Cross } from './Cross'
import { Naught } from './Naught'
import { React, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import './Game.css'

import { Link } from 'react-router-dom'
import LoggedInUser from '../header/LoggedInUser'
// TODO introduce this and other types
// class SquareState {
//     constructor( x, y, mark ) {
//         this.x = x
//         this.y = y
//         this.mark = mark
//     }
// }

function Game( props ) {
    Game.propTypes = {
        match: PropTypes.object
    }

    const [ activeMarkType, updateActiveMarkType ] = useState( null )
    const [ host, updateHost ] = useState( null )
    const [ challenger, updateChallenger ] = useState( null )
    const [ thisGameDocRef ] = useState( firebase.firestore().collection( 'games' ).doc( props.match.params.id ) )
    const [ currentUser ] = useState( firebase.auth().currentUser )
    const [ activePlayer, updateActivePlayer ] = useState( null )
    const [ allSquaresState, updateAllSquaresState ] = useState(
        [ { x: 0, y: 0, mark: 'empty' },
            { x: 1, y: 0, mark: 'empty' },
            { x: 2, y: 0, mark: 'empty' },
            { x: 0, y: 1, mark: 'empty' }, // cross and circle are other marks
            { x: 1, y: 1, mark: 'empty' },
            { x: 2, y: 1, mark: 'empty' },
            { x: 0, y: 2, mark: 'empty' },
            { x: 1, y: 2, mark: 'empty' },
            { x: 2, y: 2, mark: 'empty' }
        ] )

    useEffect( () => {
        thisGameDocRef
            .get().then( ( gameDoc ) => {
                const game = gameDoc.data()

                updateHost( game.game_host )
                updateChallenger( game.challenger )
                updateActivePlayer( game.activePlayer )

                if ( game.game_host === currentUser.uid ) {
                    // host is always naughts
                    updateActiveMarkType( 'naught' )
                } else if ( game.challenger === currentUser.uid ) {
                    // challenger is always crosses
                    updateActiveMarkType( 'cross' )
                } else if ( game.game_host !== null && game.challenger === null ) {
                    // you stumbled in here, you're the challenger now!
                    thisGameDocRef.update( { challenger: currentUser.uid } )
                }
            } )

        thisGameDocRef
            .onSnapshot( ( docSnapshot ) => {
                updateActivePlayer( docSnapshot.data().activePlayer )
            } )

        thisGameDocRef.collection( '/gamestates' )
            .orderBy( 'created_ts', 'desc' )
            .limit( 1 )
            .onSnapshot( ( querySnapshot ) => {
                if ( querySnapshot.docs.length === 1 ) {
                    const gamestateDoc = querySnapshot.docs[0].data()
                    // ignore notifications without a created_ts - serverTimestamp() update will fire immediately after
                    if ( gamestateDoc.created_ts !== null ) {
                        handleGameStateUpdateFromServer(
                            deserializeGridState( gamestateDoc.gridstate )
                        )
                    }
                } else {
                    handleGameStateUpdateFromServer( Array( 9 ).fill( 'e' ) )
                }
            } )

        function handleGameStateUpdateFromServer( gameState ) {
            // naive for now, no timing or sequence checks
            // iterate over tictactoe grid and update state of each square
            const newGameState = []
            for ( const i in [ ...Array( 9 ).keys() ] ) { // javascript sucks
                const [ x, y ] = convertGridVectorToGridCoordinate( i )
                newGameState.push( { x: x, y: y, mark: gameState[i] } )
            }

            updateAllSquaresState( newGameState )
        }
    }, [ thisGameDocRef, currentUser.uid ]
    )// we don't care about re-running this effect if props.db changes - it won't

    function convertGridVectorToGridCoordinate( vectorIndex ) {
        return [ vectorIndex % 3, Math.floor( vectorIndex / 3 ) ]
    }

    function deserializeGridState( gridStateStr ) {
        return [ ...gridStateStr ].map( char => {
            switch ( char.toUpperCase() ) {
            case 'E' : return 'empty'
            case 'X' : return 'cross'
            case 'O' : return 'naught'
            }
            throw Error( 'An error occurred.  We\'re on it. CODE 6X7' )
        } )
    }

    function serializeGridState( gridStateArr ) {
        let serializedGridState = ''
        for ( const i in [ ...Array( 9 ).keys() ] ) { // javascript sucks
            const [ x, y ] = convertGridVectorToGridCoordinate( i )
            const mark = gridStateArr.find(
                ( square ) => square.x === x && square.y === y )
                .mark
            if ( mark === 'cross' ) {
                serializedGridState += 'X'
            } else if ( mark === 'naught' ) {
                serializedGridState += 'O'
            } else {
                serializedGridState += 'e'
            }
        }

        return serializedGridState
    }

    function squareClicked( x, y, mark ) {
        if ( activePlayer === currentUser.uid
                && host != null
                && challenger != null ) {
            const allSquaresStateNew = allSquaresState.map( square => {
                if ( square.x === x && square.y === y ) {
                    return { x: square.x, y: square.y, mark: mark }
                }
                return square
            } )

            updateAllSquaresState( allSquaresStateNew )

            thisGameDocRef.collection( '/gamestates' )
                .add( {
                    gridstate: serializeGridState( allSquaresStateNew ),
                    created_ts: firebase.firestore.FieldValue.serverTimestamp()
                } )

            // mark the other player active
            thisGameDocRef.update( {
                activePlayer: host === currentUser.uid ? challenger : host
            } )
        }
    }

    return (
        <div className="Game">
            <div className="container">
                <div className="row row-center">
                    <span className="monofett-font">
                        { ( !host || !challenger )
                            ? 'Waiting for Opponent...'
                            : activePlayer === currentUser.uid
                                ? 'Your Turn!'
                                : 'Opponent\'s Turn'}
                    </span>
                </div>
                <div className="row row-space-between">
                    <LoggedInUser/>
                    <span className="monofett-font">
                        { activeMarkType === 'naught'
                            ? 'You are Naughts'
                            : ''}
                        { activeMarkType === 'cross'
                            ? 'You are Crosses'
                            : ''}
                    </span>
                </div>
            </div>
            <div className="row-layout">
                <div className="col-side">

                    {/* <button className={activeMarkType === 'naught' ? 'button-normal' : 'button-outline'}
                        onClick={() => { if ( activeMarkType === 'cross' ) { updateActiveMarkType( 'naught' ) } }}>
                          Naught Player</button>

                    <button className={activeMarkType === 'cross' ? 'button-normal' : 'button-outline'}
                        onClick={() => { if ( activeMarkType === 'naught' ) { updateActiveMarkType( 'cross' ) } }}>
                          Cross Player</button> */}

                </div>
                <div className="col-middle">

                    {/* NOTES: viewbox defines the coordinate system - for example this is 600 units wide 600 units high
                        must set fill=black and opacity=some value to be able to click an svg */}
                    <svg viewBox="0 0 600 600">

                        <line x1="200" y1="0" x2="200" y2="600" ></line>
                        <line x1="400" y1="0" x2="400" y2="600" ></line>
                        <line x1="0" y1="400" x2="600" y2="400" ></line>
                        <line x1="0" y1="200" x2="600" y2="200" ></line>

                        {/* draw naughts/crosses on grid */}
                        {allSquaresState.map( ( squareState ) => {
                            if ( squareState.mark === 'cross' ) {
                                return <Cross key={squareState.x + '' + squareState.y}
                                    x={squareState.x} y={squareState.y}></Cross>
                            }
                            if ( squareState.mark === 'naught' ) {
                                return <Naught key={squareState.x + '' + squareState.y}
                                    x={squareState.x} y={squareState.y}></Naught>
                            }
                            return null
                        } )}

                        {/* clickable invisible squares */}
                        {[ 0, 1, 2 ].map( ( x ) => {
                            return [ 0, 1, 2 ].map( ( y ) => {
                                return <RectClickable
                                    key={x + '' + y}
                                    x={x}
                                    y={y}
                                    markType={activeMarkType}
                                    rectClicked={squareClicked}></RectClickable>
                            } )
                        } )}
                    </svg>
                </div>
                <div className="col-side"><Link to="/" className="button button-cancel">Back to Lobby</Link></div>
            </div>
        </div>
    )
}
//

export default Game
