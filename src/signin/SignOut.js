import firebase from 'firebase/app'
import 'firebase/auth'
export default function SignOut( props ) {
    firebase.auth().signOut().then(
        () => props.history.push( '/signin' ) )

    return null
}
