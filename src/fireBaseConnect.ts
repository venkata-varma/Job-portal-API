const firebase = require('firebase/compat/app')



const firebaseConfig = {
    apiKey: "AIzaSyCqW-nlgYgY7i_YqAwCPM5TTpDmzL7CEMI",
    authDomain: "apnajobclone.firebaseapp.com",
    projectId: "apnajobclone",
    storageBucket: "apnajobclone.appspot.com",
    messagingSenderId: "73575903477",
    appId: "1:73575903477:web:6be21ede1ca21f9c3155bc",
    measurementId: "G-CPF887XXCM"
}

const db= firebase.initializeApp(firebaseConfig)


export default db