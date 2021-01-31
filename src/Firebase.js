import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyC6pN2zmFIMT5ovPf5NpLo4U_KZpJnxIjs",
    authDomain: "quickstart-1607600180662.firebaseapp.com",
    projectId: "quickstart-1607600180662",
    storageBucket: "quickstart-1607600180662.appspot.com",
    messagingSenderId: "917259240268",
    appId: "1:917259240268:web:cc3caf5bb4a751c6f405e9",
    measurementId: "G-N3ZZ5M1X7C"
  };

  const firebaseapp=firebase.initializeApp(firebaseConfig);

  const db=firebaseapp.firestore();
  const auth=firebaseapp.auth();
  const storage=firebaseapp.storage();



  export {db,auth,storage};