import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import reportWebVitals from './reportWebVitals'
import SignIn from './SignIn'
import { BrowserRouter } from 'react-router-dom'
import firebase from 'firebase/app'
( async function() {
    const response = await fetch( '/__/firebase/init.json' )
    const configJson = await response.json()
    firebase.initializeApp( configJson )

    ReactDOM.render(
        <BrowserRouter>
            <SignIn />
        </BrowserRouter>,
        document.getElementById( 'root' )
    )

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals()
} )()
