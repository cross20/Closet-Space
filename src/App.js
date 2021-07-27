//import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
//import ReactDOM from 'react-dom';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";

const fb = require("firebase");
// Required for side-effects
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyAwbEVuPBBU70vUpspecnHrWnE3k1dOu90",
  authDomain: "closet-space-22231.firebaseapp.com",
  databaseURL: "https://closet-space-22231-default-rtdb.firebaseio.com",
  projectId: "closet-space-22231",
  storageBucket: "closet-space-22231.appspot.com",
  messagingSenderId: "93935836929",
  appId: "1:93935836929:web:e14a7be76ce346b48d4500",
  measurementId: "G-L4L6VHW6W5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

function ClosetSpace() {
  return(
    <div>
      <p>Hello World!</p>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ClosetSpace />
      </header>
    </div>
  );
}

export default App;
