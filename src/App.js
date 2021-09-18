//import logo from './logo.svg';
import './App.css';
import React, {useState, useEffect, Fragment} from 'react';
import { nanoid } from 'nanoid';
import data from "./mock-items";

/**
 * Table row which displays an item.
 * @param {*[]} item Object displayed in the table.
 * @param {*} disabled True if a different row is being edited. Otherwise false.
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
const EditRow = ({item, onChange, onDelete, onCancel}) => {

  const Actions = () => {
    return (
      <div>
        <button onClick={onCancel}>
          Cancel
        </button>
        <button onClick={(item) => onDelete(item.id)}>
          Delete
        </button>
      </div>
    );
  }

  return (
    <ItemRow item={item}
      onChange={(newItem) => onChange(newItem)}
      disabled={false}
      submitValue="Save" 
      actions={<Actions />}>
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

  const Actions = () => {
    if (actions === undefined) {
      return (<div />);
    }

    return (
      <div>
        {actions}
      </div>
    );
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
      <Fragment>
        <Actions />
      </Fragment>
    </td>
  </tr>
  );
}

/**
 * Displays a table of items and a form to add or edit items.
 */
const Items = () => {

  /** Item containing all the default values and a random ID. */
  const defaultItem = {
    id: nanoid(),
    name: "",
    condition: "",
    quantity: 0
  };

  /** Set of items which have been saved by the user. These do not reflect what the user sees until the user adds or saves changes to an item. */
  const [savedItems, setItems] = useState(data);
  /** Set of items displayed to the user. These reflect saved and unsaved changes to the set of items. */
  const [displayItems, setDisplayItems] = useState(savedItems);
  /** Item which can be added to the set of existing items. */
  const [newItem, setNewItem] = useState(defaultItem);
  /** ID representing the item being edited. Default is -1. */
  const [editRowId, setEditRowId] = useState(-1);

  /**
   * Add a new item if the row ID is -1. Otherwise, save changes to an existing item.
   * @param {*} event 
   */
  const updateItems = (event) => {
    event.preventDefault();

    // Add a new row unless we're editing an existing row.
    if (editRowId === -1) {
      appendDisplayItems(newItem);
      setNewItem(defaultItem);
    } else if (validateRowId(editRowId)) {
      setItems(displayItems);
      setEditRowId(-1);
    }
  }

  /**
   * Add a new item.
   * @param {*} newItem Item to add.
   */
  const appendDisplayItems = (newItem) => {
    const newItems = [ ...displayItems ];

    newItems.push(newItem);

    setDisplayItems(newItems);
    setItems(newItems);
  }

  /**
   * Changes an existing item.
   * @param {*} newItem Replaces the existing item.
   */
  const updateDisplayItems = (newItem) => {
    const newItems = [ ...displayItems ];

    for (var i = 0; i < newItems.length; i++) {
      if (newItems[i].id === newItem.id) {
        newItems[i] = newItem;
      }
    }

    setDisplayItems(newItems);
    // Do not set items here because we haven't saved our changes yet.
  }

  /**
   * Cancel changes to an existing item by overwriting all display items with saved items.
   */
  const revertDisplayItems = () => {
    setDisplayItems(savedItems);
    setEditRowId(-1);
  }

  /**
   * Prompt the user to confirm they would like to delete an item. If confirmed, delete the item.
   * @param {*} oldItemId ID of the item to delete.
   */
  const deleteDisplayItems = (oldItemId) => {
    const newItems = [ ...displayItems ];
    const oldItemIndex = newItems.findIndex(item => item.id === oldItemId);
    newItems.splice(oldItemIndex, 1);

    if (window.confirm("Delte this item?")) {
      setDisplayItems(newItems);
      setItems(newItems);
      setEditRowId(-1);
    }
  }

  /**
   * Verifies a row with the provided ID exists in the display items.
   * @param {*} rowId ID corresponding to an item.
   */
  const validateRowId = (rowId) => {
    if (displayItems.findIndex(item => item.id === rowId) > -1) {
      return true;
    }

    console.log("Could not validate row ID: ", rowId);

    return false;
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
              {item.id === editRowId ?
                <EditRow key={item.id} item={item}
                  onChange={(newItem) => updateDisplayItems(newItem)}
                  onDelete={(oldItemId) => deleteDisplayItems(oldItemId)}
                  onCancel={() => revertDisplayItems()}>
                </EditRow>
              :
                <ReadOnlyRow key={item.id} 
                  item={item} 
                  disabled={editRowId !== -1} 
                  onEdit={(rowId) => setEditRowId(rowId)}>
                </ReadOnlyRow>
              }
            </Fragment>
          ))}
          <NewRow id={newItem.id}
            disabled={editRowId !== -1}
            newItem={newItem}
            onChange={(newItem) => setNewItem(newItem)}>
          </NewRow>
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
