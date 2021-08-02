//import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import data from "./mock-items"
//import ReactDOM from 'react-dom';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";
import { func } from 'prop-types';

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

/** 
 * Table header.
 * @param {props} Value - data to include in the header.
 */
const Header = (props) => {
  return (
    <th class="Table">
      {props.value}
    </th>
  )
}

/** 
 * Table data.
 * @param {props} Value - data to include in the cell.
 */
const Cell = (props) => {
  // TODO: determine how to align text to left using CSS.
  return (
    <td class="Table">
      {props.value}
    </td>
  )
}

const Items = () => {

  const [items, setItems] = useState(data);

  return (
    <div className='Items'> {/* TODO: Implement CSS class name */}
      <table>
        <thead>
          <tr>
            <Header value="Name" />
            <Header value="Condition" />
            <Header value="Quantity" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr>
              <Cell value={item.name} />
              <Cell value={item.condition} />
              <Cell value={item.quantity} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Items />
    </div>
  );
}

export default App;
