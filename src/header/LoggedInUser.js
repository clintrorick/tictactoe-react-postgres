import React from 'react'
import firebase from 'firebase/app'
export default function LoggedInUser( props ) {
    const currUser = firebase.auth().currentUser
    function displayName( currUser ) {
        return currUser && currUser.displayName
                        ? currUser.displayName.split( ' ' )[0]
                        : currUser.uid.substr( 0, 4 )
    }
    return currUser
            ? <span className="monofett-font">{displayName( currUser )}</span>
            : <span></span>
}
