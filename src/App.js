//import logo from './logo.svg';
import './App.css';
import React, {useState, Fragment} from 'react';
import { nanoid } from 'nanoid';
import data from "./mock-items";
//import ReactDOM from 'react-dom';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import "firebase/auth";

// eslint-disable-next-line
const fb = require("firebase"); // TODO: implement database.
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
// eslint-disable-next-line
const db = firebase.firestore(); // TODO: implement database

/**
 * Table row which displays an item.
 * @param {*[]} item Object displayed in the table.
 * @param {*} disabled True of a different row is being edited. Otherwise false.
 * @param {*} onEdit Method which sets the id of the row being edited.
 */
const ReadOnlyRow = ({item, disabled, onEdit}) => {
  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.condition}</td>
      <td>{item.quantity}</td>
      <td>
        <button disabled={disabled} onClick={() => onEdit(item.id)}>Edit</button>
      </td>
    </tr>
  );
}

/**
 * Table row made of inputs. Used to modify the item associated with the row.
 * @param {*[]} item Object displayed and modified by the inputs of the row.
 * @param {*} onChange Method which modifies the values of the the item.
 * @param {*} onCancel Method which responds to the Cancel button being selected.
 */
const EditRow = ({item, onChange, onCancel}) => {
  return (
    <ItemRow item={item}
      onChange={(newItem) => onChange(newItem)}
      disabled={false}
      submitValue="Save" 
      actions={
        <button onClick={onCancel}>
          Cancel
        </button>
      }>
    </ItemRow>
  );
}

/**
 * Table row made of inputs. Used to add a new item to the table.
 * @param {*[]} newItem Object displayed and modified by the inputs of the row.
 * @param {*} disabled Whether a row is being edited or not.
 * @param {*} onChange Method which modifies the values of the the item.
 */
const NewRow = ({newItem, disabled, onChange}) => {
  return (
    <ItemRow item={newItem}
      disabled={disabled}
      onChange={(newItem) => onChange(newItem)}
      submitValue="Add">
    </ItemRow>
  );
}

/**
 * Table row made of inputs. Each input corresponds to a property of the item.
 * @param {*[]} item Object used to set the values of each input.
 * @param {*} disabled Boolean which enables or disabled the inputs.
 * @param {*} onChange Method which sets the value of the item.
 * @param {*} submitValue String which sets the text inside the submit button.
 * @param {*} [actions] Component containing buttons which perform actions other than submit. 
 */
const ItemRow = ({item, disabled, onChange, submitValue, actions}) => {

  if (actions === undefined) {
    actions = () => {return (<div />)}
  }

  const changeItem = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newItem = { ...item };
    newItem[fieldName] = fieldValue;

    onChange(newItem);
  }

  return (
    <tr>
    <td>
      <input form="items-form"
        type="text"
        name="name"
        required={true}
        disabled={disabled}
        value={item.name}
        onChange={changeItem}>
      </input>
    </td>
    <td>
      <input form="items-form"
        type="text" 
        name="condition"
        required={true}
        disabled={disabled}
        value={item.condition}
        onChange={changeItem}>
      </input>
    </td>
    <td>
      <input form="items-form"
        type="number"
        min={1}
        name="quantity"
        required={true}
        disabled={disabled}
        value={item.quantity}
        onChange={changeItem}>
      </input>
    </td>
    <td>
      <input form="items-form"
        type="submit"
        disabled={disabled}
        value={submitValue}>
      </input>
      <Fragment>{actions}</Fragment>
    </td>
  </tr>
  );
}

/**
 * Displays a table of items and a form to add or edit items.
 */
const Items = () => {

  const defaultItem = {
      id: nanoid(),
      name: "",
      condition: "",
      quantity: 0
    };

  const [items, setItems] = useState(data);
  const [displayItems, setDisplayItems] = useState(items);
  const [newItem, setNewItem] = useState(defaultItem);
  const [editRowId, setEditRowId] = useState(-1);

  const updateItems = (event) => {
    event.preventDefault();

    if (editRowId === -1) {
      appendDisplayItems(newItem);
      setNewItem(defaultItem);
    } else {
      setEditRowId(-1);
    }

    setItems(displayItems);
  }

  const updateDisplayItems = (newItem) => {
    const newItems = [ ...displayItems ];

    for (var i = 0; i < newItems.length; i++) {
      if (newItems[i].id === newItem.id) {
        newItems[i] = newItem;
      }
    }

    setDisplayItems(newItems);
  }

  const revertDisplayItems = () => {
    setDisplayItems(items);
    setEditRowId(-1);
  }

  const appendDisplayItems = (newItem) => {
    const newItems = [ ...displayItems ];

    newItems.push(newItem);

    setDisplayItems(newItems);
  }

  return (
    <div className='Items-table'> {/* TODO: Implement CSS class name */}
      <form id="items-form" onSubmit={updateItems} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item) => (
            <Fragment key={item.id}>
              { item.id === editRowId ?
                <EditRow key={item.id} item={item} onChange={(newItem) => updateDisplayItems(newItem)} onCancel={() => revertDisplayItems()}></EditRow> :
                <ReadOnlyRow key={item.id} item={item} disabled={editRowId !== -1} onEdit={(rowId) => setEditRowId(rowId)}></ReadOnlyRow> }
            </Fragment>
          ))}
          <NewRow id={newItem.id} disabled={editRowId !== -1} newItem={newItem} onChange={(newItem) => setNewItem(newItem)}></NewRow>
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
