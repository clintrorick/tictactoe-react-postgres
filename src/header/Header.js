import React from 'react'
import './Header.css'
import firebase from 'firebase/app'
export default function Header( props ) {
    return <div className="container">
        <div className="row row-center" ><h1>Naughts and Crosses</h1></div>
        {firebase.auth().currentUser ? <div className="row row-center"><p>Logged in as <strong>{firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName : firebase.auth().currentUser.uid.substr( 0, 4 )}</strong></p></div> : <div></div>}

    </div>
}
