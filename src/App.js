import React, { useState } from 'react';
// import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase.config';
firebase.initializeApp(firebaseConfig);



function App() {

  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: '',
    error: '',
    isValid: false,
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then(res => {
      const {displayName, photoURL, email, password} = res.user;
      const singInuser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
        password: password,
      }
      setUser(singInuser);
      console.log(photoURL, displayName, email)
    })
    .catch(err =>{
      console.log(err);
      console.log(err.message);
    })
  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedin: false,
        name: '',
        email: '',
        photo: '',
        password: '',
        error: '',
        isValid: false,
        existingUser: false,
      }
      setUser(signedOutUser);
      console.log(res);
    })
    .catch(err => {

    })
  }

  const is_valid_email = email => /^[^@]+@[^@]{2,}\.[^@]{2,}$/.test(email);
  const hasNumber = input => /\d/.test(input);

  const switchForm = e => {
    const createdUser = {...user};
    createdUser.existingUser = e.target.checked;
    setUser(createdUser);
    console.log(e.target.checked);
  }

  const handleChange = e => {
    const newUserInfo = {
      ...user
    };
    

    //perfore validation
    let isValid = true;
    if(e.target.name === 'email'){
      isValid = is_valid_email(e.target.value);
    }
    if(e.target.name === 'password'){
      isValid = e.target.value.length > 8 && hasNumber(e.target.value);
    }

    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  

  const creatAccount = (event) => {
    if(user.isValid){
      console.log({name:user.email, password:user.passward});
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
  }
  // debugger;

  const signInUser = event => {
    if(user.isValid){
      console.log({name:user.email, password:user.passward});
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err => {
        console.log(err.message);
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
      {
        user.isSignedIn ?<button onClick={handleSignOut} >Sign Out</button> :
        <button onClick={handleSingIn} >Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }
      <h2>Sign Up with Email</h2>
      <br/>
      <input type="checkbox" name="switchForm" onChange={switchForm}/>
      <label htmlFor="switchForm"> Returning User</label>
      <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInUser}>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Passward" required/>
        <br/><br/>
        <input type="submit" value="Sign In"/>
      </form>

      <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={creatAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Passward" required/>
        <br/><br/>
        <input type="submit" value="Create Account"/>
      </form>

      {
        user.error && <p style={{color: 'red'}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
