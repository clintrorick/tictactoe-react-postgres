import firebase from 'firebase/app'
import 'firebase/auth'
import { auth } from 'firebaseui'
import { React, useState, useEffect } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import Lobby from './Lobby'

firebase.initializeApp( {
    apiKey: 'AIzaSyCZfH6FqU7Cxt6dGpreFjsSGi2kyJRz5sc',
    authDomain: 'naughts-crosses-react.firebaseapp.com',
    projectId: 'naughts-crosses-react',
    storageBucket: 'naughts-crosses-react.appspot.com',
    messagingSenderId: '806201065463',
    appId: '1:806201065463:web:b5fd72168a2c49e13d78f2',
    measurementId: 'G-D3Z1SLCYWS'
} )
const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        auth.AnonymousAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        // Avoid redirects after sign-in.
        signInSuccessWithAuthResult: () => false
    }
}
function SignIn( ) {
    const [ isSignedIn, setIsSignedIn ] = useState( false ) // Local signed-in state.

    // Listen to the Firebase Auth state and set the local state.
    useEffect( () => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged( user => {
            setIsSignedIn( !!user )
        } )
        return () => unregisterAuthObserver()
        // Make sure we un-register Firebase observers when the component unmounts.
    }, [] )

    if ( !isSignedIn ) {
        return (
            <div>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
        )
    }
    return (
        <Lobby></Lobby>
    )
}

export default SignIn
