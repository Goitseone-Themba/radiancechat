import React, {useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { serverTimestamp } from 'firebase/compat/firestore';


import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAszU2iF_u2gtpcrFiZqDoCHTrQ_Ad5aEo",
  authDomain: "radiencechat.firebaseapp.com",
  projectId: "radiencechat",
  storageBucket: "radiencechat.appspot.com",
  messagingSenderId: "809552881256",
  appId: "1:809552881256:web:1bf158fe62b17d8096bddd"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
      <h1>Radience chat 🔥🔥🔥</h1>
        <SignOut />
      </header>

      <section >
        {user ? <ChatRoom /> : <SignIn />} 
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (<>
    <h2 className='welcome-message'>
      All users in one Room!!!!! 
    </h2>

    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    </>)
}

function SignOut()  {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()} >Sign Out</button>
  )
}

function ChatRoom() {

  const dummy = useRef()

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e) => {

    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue("");

    dummy.current.scrollIntoView({ behaivour: 'smooth' });

  }

  return  (<>
  
    <main>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input  value={formValue} onChange={(e) => setFormValue(e.target.value)} />

      <button type="submit" disabled={!formValue} >🚀</button>
    </form>

    </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

   const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (<>
    <div className={'message ${messageClass}'}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
    </>)
}

export default App;
