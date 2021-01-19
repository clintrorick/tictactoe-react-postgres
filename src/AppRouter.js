import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Lobby from './lobby/Lobby'
import Game from './game/Game'
import SignIn from 'signin/SignIn'
import firebase from 'firebase/app'
import 'firebase/auth'

function AppRouter( props ) {
    return <Switch>

        <Route exact path="/" render={ prps =>
            firebase.auth().currentUser == null
                ? <Redirect to={
                    {
                        pathname: '/signin',
                        state: { from: prps.location }
                    }
                }></Redirect>
                : <Lobby {...prps} /> }/>

        <Route path="/games/:id"
            render={ prps =>
                firebase.auth().currentUser == null
                ? <Redirect to={
                    {
                        pathname: '/signin',
                        state: { from: prps.location }
                    }
                }></Redirect>
                : <Game {...prps} /> }/>

        <Route path="/signin" render={ prps => <SignIn {...prps} /> }></Route>
        {/* ^^^ necessary shenanigans for passing router params as props... */}
    </Switch>
}

export default AppRouter
