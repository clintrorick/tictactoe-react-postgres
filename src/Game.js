import './Game.css'
import { RectClickable } from './RectClickable'
import PropTypes from 'prop-types'
import { Cross } from './Cross'
import { Circle } from './Circle'
import { React, useState, useEffect } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Link } from 'react-router-dom'
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
    useEffect( () => {
        firebase.firestore().collection( 'games/' + props.match.params.id + '/gamestates' )
            .orderBy( 'created_ts', 'desc' )
            .limit( 1 )
            .onSnapshot( ( querySnapshot ) => {
                if ( querySnapshot.docs.length === 1 ) {
                    // ignore notifications without a created_ts - serverTimestamp() update will fire immediately after
                    if ( querySnapshot.docs[0].data().created_ts !== null ) {
                        handleGameStateUpdateFromServer(
                            deserializeGridState( querySnapshot.docs[0].data().gridstate )
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
    }, [ props.match.params.id ]
    )// we don't care about re-running this effect if props.db changes - it won't

    function convertGridVectorToGridCoordinate( vectorIndex ) {
        return [ vectorIndex % 3, Math.floor( vectorIndex / 3 ) ]
    }

    function deserializeGridState( gridStateStr ) {
        return [ ...gridStateStr ].map( char => {
            switch ( char.toUpperCase() ) {
            case 'E' : return 'empty'
            case 'X' : return 'cross'
            case 'O' : return 'circle'
            }
            throw Error( 'An error occurred.  We\'re on it. CODE 6X7' )
        } )
    }

    // TODO pick gridstate or squarestate as preferred term
    function serializeGridState( gridStateArr ) {
        let serializedGridState = ''
        for ( const i in [ ...Array( 9 ).keys() ] ) { // javascript sucks
            const [ x, y ] = convertGridVectorToGridCoordinate( i )
            const mark = gridStateArr.find(
                ( square ) => square.x === x && square.y === y )
                .mark
            if ( mark === 'cross' ) {
                serializedGridState += 'X'
            } else if ( mark === 'circle' ) {
                serializedGridState += 'O'
            } else {
                serializedGridState += 'e'
            }
        }

        return serializedGridState
    }

    const [ activeMarkType, updateActiveMarkType ] = useState( 'circle' )

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

    function squareClicked( x, y, mark ) {
        const allSquaresStateNew = allSquaresState.map( square => {
            if ( square.x === x && square.y === y ) {
                return { x: square.x, y: square.y, mark: mark }
            }
            return square
        } )

        updateAllSquaresState( allSquaresStateNew )

        firebase.firestore().collection( 'games/' + props.match.params.id + '/gamestates' )
            .add( {
                gridstate: serializeGridState( allSquaresStateNew ),
                /* TODO using serverTimestamp() causes a double-event-fire
                  (document created, document updated w/server timestamp) */
                created_ts: firebase.firestore.FieldValue.serverTimestamp()
            } )
    }

    return (
        <div className="Game">
            <div className="row-layout">
                <div className="col-side">
                    <button className={activeMarkType === 'circle' ? '' : 'button-outline'}
                        onClick={() => { if ( activeMarkType === 'cross' ) { updateActiveMarkType( 'circle' ) } }}>
                          Circle Player</button>

                    <button className={activeMarkType === 'cross' ? '' : 'button-outline'}
                        onClick={() => { if ( activeMarkType === 'circle' ) { updateActiveMarkType( 'cross' ) } }}>
                          Cross Player</button>

                </div>
                <div className="col-middle">

                    {/* NOTES: viewbox defines the coordinate system - for example this is 600 units wide 600 units high
                        must set fill=black and opacity=some value to be able to click an svg */}
                    <svg viewBox="0 0 600 600">

                        <line x1="200" y1="0" x2="200" y2="600" ></line>
                        <line x1="400" y1="0" x2="400" y2="600" ></line>
                        <line x1="0" y1="400" x2="600" y2="400" ></line>
                        <line x1="0" y1="200" x2="600" y2="200" ></line>

                        {/* draw crosses/circles on grid */}
                        {allSquaresState.map( ( squareState ) => {
                            if ( squareState.mark === 'cross' ) {
                                return <Cross key={squareState.x + '' + squareState.y}
                                    x={squareState.x} y={squareState.y}></Cross>
                            }
                            if ( squareState.mark === 'circle' ) {
                                return <Circle key={squareState.x + '' + squareState.y}
                                    x={squareState.x} y={squareState.y}></Circle>
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
                <div className="col-side"><Link to="/" className="button">Back to Lobby</Link></div>
            </div>
        </div>
    )
}
//

export default Game
