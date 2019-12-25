import firebase from 'firebase/app';
import firestore from 'firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: 'AIzaSyDU-YuDfg0j5a5HFyF3EwFKzQN0rnbySzo',
    authDomain: 'alias-81e6c.firebaseapp.com',
    databaseURL: 'https://alias-81e6c.firebaseio.com',
    projectId: 'alias-81e6c',
    storageBucket: 'alias-81e6c.appspot.com',
    messagingSenderId: '163782781874',
    appId: '1:163782781874:web:4c80453b7ab19a3f2752ab',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var dbFieldValue = firebase.firestore.FieldValue;

export { db, firestore, dbFieldValue };
