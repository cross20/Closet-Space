//import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';
import { nanoid } from 'nanoid';
import data from "./mock-items";
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
  const [itemData, setItemData] = useState({
    name: '',
    condition: '',
    quantity: 0
  })

  const addItemData = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute('name');
    const fieldValue = event.target.value;

    const newItemData = { ...itemData };
    newItemData[fieldName] = fieldValue;

    setItemData(newItemData);
  }

  const addItem = (event) => {
    event.preventDefault();

    const newItem = {
      id: nanoid(),
      name: itemData.name,
      condition: itemData.condition,
      quantity: itemData.quantity
    };

    const newItems = [ ...items, newItem ];

    setItems(newItems);
  }

  return (
    <div className='Items'> {/* TODO: Implement CSS class name */}
      <div className='Items-table'> {/* TODO: Implement CSS class name */}
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
      <div className='Items-form'> {/* TODO: Implement CSS class name */}
        <form onSubmit={addItem}>
          <label>Name</label>
          <input type="text"
                 name="name"
                 required="required" 
                 onChange={addItemData}></input>

          <label>Condition</label>
          <input type="text" 
                 name="condition"
                 required="required"
                 onChange={addItemData}></input>

          <label>Quantity</label>
          <input type="number"
                 name="quantity"
                 required="required"
                 onChange={addItemData}></input>

          <input type="submit"
                 value="Submit"></input>
        </form>
      </div>
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
