//import logo from './logo.svg';
import './App.css';
import React, {useState, Fragment} from 'react';
import { nanoid } from 'nanoid';
import data from "./mock-items";
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
  return (
    <td class="Table">
      {props.value}
    </td>
  );
}

/**
 * 
 * @param {props} Type - determines which mode to use when the action is taken.
 * @param {props} Mode - determines how the table row can be interacted with.
 * @param {props} SetMode - function for setting the mode of the parent.
 */
const ActionCell = (props) => {

  const [editItemId, setEditItemId] = useState(props.editItemId);

  // TODO: determine how to align text to left using CSS.
  if (props.type === 'edit') {

    const handleEditItemId = (editItemId) => {
      setEditItemId(editItemId);
      props.setEditItemId(editItemId);
    }

    return (
      <td class='Table'>
        <button onClick={() => handleEditItemId(props.itemId)}>
          Edit
        </button>
      </td>
    );
  }
}

const ReadableRow = ({ item, editItemId, setEditItemId }) => {
  return (
    <tr>
      <Cell value={item.name} />
      <Cell value={item.condition} />
      <Cell value={item.quantity} />
      <ActionCell type="edit" itemId={item.id} editItemId={editItemId} setEditItemId={(id) => setEditItemId(id)} />
    </tr>
  );
}

const EditableRow = ({ onChange, onCancel }) => {
  return (
    <tr>
      <td>
        <input type="text"
          name="name"
          required="required"
          onChange={onChange}>
        </input>
      </td>
      <td>
        <input type="text" 
          name="condition"
          required="required"
          onChange={onChange}>
        </input>
      </td>
      <td>
        <input type="number"
          name="quantity"
          required="required"
          onChange={onChange}>
        </input>
      </td>
      <td>
        <input type="submit"
          value="Save">
        </input>
        <button onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
}

const NewRow = ({ addItemData, disabled }) => {
  return (
    <tr>
      <td>
        <input type="text"
          name="name"
          required="required" 
          onChange={addItemData}>
        </input>
      </td>
      <td>
        <input type="text" 
          name="condition"
          required="required"
          onChange={addItemData}>
        </input>
      </td>
      <td>
        <input type="number"
          name="quantity"
          required="required"
          onChange={addItemData}>
        </input>
      </td>
      <td>
        <input type='submit'
          value='Add'
          disabled={disabled}>
        </input>
      </td>
    </tr>
  );
}

const Items = () => {

  const [items, setItems] = useState(data);
  const [itemData, setItemData] = useState({
    name: '',
    condition: '',
    quantity: 0
  });
  const [editItemId, setEditItemId] = useState(null);

  const submitItem = (event) => {
    if (editItemId === null) {
      addItem(event);
      // TODO: determine how to clear form inputs after add item.
    } else {
      updateItem(event);
    }
  }

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

  const updateItem = (event) => {
    event.preventDefault();
    
    const newItem = {
      id: editItemId,
      name: itemData.name,
      condition: itemData.condition,
      quantity: itemData.quantity
    };

    var newItems = [ ...items ];

    for ( var i = 0; i < newItems.length; i++ ) {
      if(newItems[i].id === newItem.id) {
        newItems[i] = newItem;
      }
    }

    setItems(newItems);
    setEditItemId(null);
  }

  const onCancel = () => {
    setEditItemId(null);
  }

  return (
    <div className='Items'> {/* TODO: Implement CSS class name */}
      <div className='Items-table'> {/* TODO: Implement CSS class name */}
        <form name="items-form" onSubmit={submitItem}>
          <table>
            <thead>
              <tr>
                <Header value="Name" />
                <Header value="Condition" />
                <Header value="Quantity" />
                <Header value="Actions" />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <Fragment>
                  { item.id === editItemId ?
                    (<EditableRow onChange={addItemData} onCancel={onCancel}/>) : 
                    (<ReadableRow item={item} editItemId={editItemId} setEditItemId={(id) => setEditItemId(id)} />)
                  }
                </Fragment>
              ))}
              <NewRow addItemData={addItemData} disabled={editItemId !== null}></NewRow>
            </tbody>
          </table>
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
