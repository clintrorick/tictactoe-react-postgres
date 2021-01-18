import firebase from 'firebase/app'
import 'firebase/auth'
import { auth } from 'firebaseui'
import { React, useState, useEffect, useLayoutEffect, useRef } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import './SignIn.css'
import Header from '../header/Header'
import { Redirect } from 'react-router'
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
function SignIn( props ) {
    const mainDiv = useRef( null )
    const [ isSignedIn, setIsSignedIn ] = useState( false ) // Local signed-in state.

    // restore scroll and keyboard focus when kicking back to signout
    useLayoutEffect( () => {
        if ( mainDiv.current ) {
            mainDiv.current.focus()
            window.scroll( 0, 0 )
        }
    }, [ isSignedIn ] )
    // Listen to the Firebase Auth state and set the local state.
    useEffect( () => {
        const unregisterAuthObserver = firebase.auth().onAuthStateChanged( user => {
            // TODO - set cool random name here for the anonymous user

            setIsSignedIn( !!user )
        } )
        return () => unregisterAuthObserver()
        // Make sure we un-register Firebase observers when the component unmounts.
    }, [] )

    if ( !isSignedIn ) {
        return (
            <div ref={mainDiv} className="firebaseui-root">
                <Header/>
                <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </div>
        )
    } else {
        return <Redirect to='/'></Redirect>
    }
}

export default SignIn
