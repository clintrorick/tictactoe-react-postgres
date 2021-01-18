import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import { Router } from 'react-router-dom'
import firebase from 'firebase/app'
import { createBrowserHistory } from 'history'
import { wrapHistory } from 'oaf-react-router'
import AppRouter from 'AppRouter'

const history = createBrowserHistory()
const settings = { primaryFocusTarget: 'body' }
wrapHistory( history, settings );
( async function() {
    const response = await fetch( '/__/firebase/init.json' )
    const configJson = await response.json()
    firebase.initializeApp( configJson )

    ReactDOM.render(
        <Router history={history}>
            <AppRouter />
        </Router>,
        document.getElementById( 'root' )
    )

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals()
} )()
