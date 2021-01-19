in Game Lobby, updating challenger and challenger_name within a doc doesn't seem to be triggering a collection update, despite docs indicating doc updates will result in client notifications 
https://firebase.google.com/docs/reference/node/firebase.firestore.CollectionReference

currently accepting local events, which can cause rubber-band behavior - prefer only reacting to server events for important state updates (unimportant state updates are fine to receive local events)