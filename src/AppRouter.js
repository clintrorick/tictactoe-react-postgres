import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Lobby from './lobby/Lobby'
import Game from './game/Game'
import SignIn from 'signin/SignIn'
import firebase from 'firebase/app'
import 'firebase/auth'

function AppRouter( props ) {
    return <Switch>

        <Route exact path="/" render={ props =>
            firebase.auth().currentUser == null
                ? <Redirect to="/signin"></Redirect>
                : <Lobby {...props} /> }/>

        <Route path="/games/:id"
            render={ props =>
                firebase.auth().currentUser == null
                ? <Redirect to="/signin"></Redirect>
                : <Game {...props} /> }/>

        <Route path="/signin" render={ props => <SignIn {...props} /> }></Route>
        {/* ^^^ necessary shenanigans for passing router params as props... */}
    </Switch>
}

export default AppRouter
