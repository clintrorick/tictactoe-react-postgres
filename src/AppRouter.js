import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Lobby from './lobby/Lobby'
import Game from './game/Game'

function AppRouter( props ) {
    return <Switch>
        <Route exact path="/" render={ props => <Lobby {...props} /> }/>
        <Route path="/games/:id"
            render={ props => <Game {...props} /> }/>
        {/* ^^^ necessary shenanigans for passing router params as props... */}
    </Switch>
}

export default AppRouter
