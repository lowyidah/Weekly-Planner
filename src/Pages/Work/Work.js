import './Work.css';
import React, { useState, useEffect, useCallback } from 'react';
import Navigation from '../../Components/Navigation/Navigation.js';
import Footer from '../../Components/Footer/Footer.js';
import ListInput from './Components/ListInput/ListInput.js';
import ItemEditor from '../../Components/ItemEditor/ItemEditor.js';
import ItemList from './Components/ItemList/ItemList.js';



const Work = ( {pageType, reloadUser, changeRoute, user, signOut, backendUrl }) => {


  let pageName, category;
  if (pageType === 'work') {
    pageName = 'Work';
    category = 'work';
  }
  else if (pageType === 'errands') {
    pageName = 'Errands';
    category = 'errand';
  }
  else if (pageType === 'summary') {
    pageName = 'Summary';
    category = undefined;
  }

  const emptyInput = {
    id: '', 
    position: '',
    description: '',
    hours: '',
    mins: '',
    details: '',
    due: ''
  };

  const [popup, setPopup] = useState({
    appear: false,
    id: '',
    type: ''
  });

  const [input, setInput] = useState(Object.assign({}, emptyInput));
  const [items, setItems] = useState([]);
  const [doingItems, setDoingItems] = useState([]);
  const [doneItems, setDoneItems] = useState([]);


  const loadItems = useCallback(() => {
    fetch(backendUrl + '/loaditems', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        list: 'items',
        category: category
      })
    })
    .then(response => response.json())
    .then(items => setItems(items))
    .catch(err => console.log('Error loading items:', err));
  }, [user.id, category, backendUrl]);

  const loadDoingItems = useCallback(() => {
    fetch(backendUrl + '/loaditems', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        list: 'doingitems',
        category: category
      })
    })
    .then(response => response.json())
    .then(doingItems => setDoingItems(doingItems))
    .catch(err => console.log('Error loading done items:', err));
  }, [user.id, category, backendUrl]);

  const loadDoneItems = useCallback(() => {
    fetch(backendUrl + '/loaditems', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        list: 'doneitems',
        category: category
      })
    })
    .then(response => response.json())
    .then(doneItems => setDoneItems(doneItems))
    .catch(err => console.log('Error loading done items:', err));
  }, [user.id, category, backendUrl]);

  const loadAllItems = useCallback(() => {
    loadItems();
    loadDoingItems();
    loadDoneItems();
  }, [loadItems, loadDoingItems, loadDoneItems]);

  const onInputChange = (inputType, event) => {
    let newInput = Object.assign({}, input);
    if(inputType === 'description'){
      newInput.description = event.target.value;
    }
    else if(inputType === "hours"){
      newInput.hours = event.target.value;
      if(newInput.hours === '') {
        newInput.hours = '';
      }
    }
    else if(inputType === "mins"){
      newInput.mins = event.target.value;
      if(newInput.mins === '') {
        newInput.mins = '';
      }
    }
    else if(inputType === "details"){
      newInput.details = event.target.value;
    }
    else if (inputType === 'datetime') {
      console.log(event.target.value)
      newInput.due = (new Date(event.target.value)).toISOString();
    }
    setInput(newInput);
  }

  const onButtonAdd = (list) => {
    if (input.description === ""){
      return;
    }

    fetch(backendUrl + '/additem', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        description: input.description, 
        hours: input.hours, 
        mins: input.mins, 
        details: input.details,
        category: category,
        due: input.due,
        list: list
      })
    })
    .then(() => {
      if (list === 'items') loadItems();
      else if (list === 'doingitems') loadDoingItems();
    })
    .catch(err => console.log('Error adding item:', err));

    setInput(Object.assign({}, emptyInput));
    const inputFields = document.querySelectorAll(".inputField");
    inputFields.forEach(element => {
      element.value = "";
    });
  }

  const closePopup = () => {
    let newPopup = popup;
    newPopup.appear = false;
    setPopup(newPopup);
  }

  const onButtonSaveChange = (type) => {

    let newItem = Object.assign({}, input);

    fetch(backendUrl + '/edititem', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        editedItem: newItem
      })
    })
    .then(() => {
      if (type === 'todo') {
        loadItems();
      }
      else if (type === 'done') {
        loadDoneItems();
      }
      else if (type === 'doing') {
        loadDoingItems();
      }
    })
    .catch(err => console.log('Error saving edit:', err));

    setInput(Object.assign({}, emptyInput));
    closePopup();
  }

  const onButtonCancelChange = () => {
    setInput(Object.assign({}, emptyInput));
    closePopup();
  }

  const insulateClick = (event) => {
    event.stopPropagation();
  }

  const onButtonDelete = (id, type) => {
    fetch(backendUrl + '/deleteitem', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: id
      })
    })
    .then(() => {
      if (type === 'item') {
        loadItems();
      }
      else if (type === 'doingitem') {
        loadDoingItems();
      }
      else if (type === 'doneitem') {
        loadDoneItems();
      }
    })
    .catch(err => console.log('Error deleting item:', err));
  }

  const onButtonTransfer = (id, listTo) => {
    fetch(backendUrl + '/transferitem', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: id,
        listTo: listTo
      })
    })
    .then(() => loadAllItems())
    .catch(err => console.log('Error transfering item to other list:', err));
  }

  const onButtonReorder = (id, direction, list) => {
    fetch(backendUrl + '/reorderitems', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: user.id,
        id: id,
        direction: direction,
        category: category,
        list: list
      })
    })
    .then(() => loadAllItems())
    .catch(err => console.log('Error reordering items:', err));
  }

  const onButtonEdit = (type, id) => {
    let newPopup = popup;
    newPopup.appear = true;
    newPopup.id = id;
    newPopup.type = type;
    setPopup(newPopup);
    let newInput;
    if(type === 'todo') {
      newInput = Object.assign({}, items.filter(item => item.id === id)[0]);
    }
    else if(type === 'done') {
      newInput = Object.assign({}, doneItems.filter(item => item.id === id)[0]);
    }
    else if(type === 'doing') {
      newInput = Object.assign({}, doingItems.filter(item => item.id === id)[0]);
    }
    setInput(newInput);
  }  

  useEffect(() => {
    reloadUser();
  }, [reloadUser]); 

  useEffect(() => {
    if(user.id) {
      loadAllItems();
    }
  }, [user.id, loadAllItems, pageType])

  let list, itemEditor, wrapper, title;
  if (pageType === 'errands' || pageType === 'work') {
    list = (
      <div className='threeLists mv3'>
        <div>
          <ItemList backendUrl={backendUrl} listType={'todo'} items={items} onButtonOpenPopup={onButtonEdit} onButtonReorder={onButtonReorder}
          onButtonTransfer={onButtonTransfer} onButtonDelete={onButtonDelete}/>
        </div> 
        <div>
          <ItemList backendUrl={backendUrl} listType={'doing'} items={doingItems} onButtonOpenPopup={onButtonEdit} onButtonReorder={onButtonReorder}
          onButtonTransfer={onButtonTransfer} onButtonDelete={onButtonDelete}/>
        </div>
        <div>
          <ItemList backendUrl={backendUrl} listType={'done'} items={doneItems} onButtonOpenPopup={onButtonEdit} onButtonReorder={onButtonReorder}
          onButtonTransfer={onButtonTransfer} onButtonDelete={onButtonDelete}/>
        </div>
      </div>
    );
    itemEditor = (
      <div>
        <ListInput onInputChange={onInputChange} onButtonAdd={onButtonAdd}/>
      </div>
    );
    wrapper = 'workWrapper';
    title = <div className='f2 fw5 pv3 mv2 br3 titleWork'>{pageName}</div>;
  }
  else if (pageType === 'summary') {
    list = (
      <div className='twoLists'> 
        <div>
          <ItemList backendUrl={backendUrl} listType={'todo'} items={items} onButtonOpenPopup={onButtonEdit} onButtonReorder={onButtonReorder}
          onButtonTransfer={onButtonTransfer} onButtonDelete={onButtonDelete}/>
        </div>
        <div>
          <ItemList backendUrl={backendUrl} listType={'doing'} items={doingItems} onButtonTransfer={onButtonTransfer} 
          onButtonDelete={onButtonDelete} onButtonOpenPopup={onButtonEdit} onButtonReorder={onButtonReorder}/>
        </div>
      </div>
    );
    itemEditor = null;
    wrapper = 'summaryWrapper';
    title = <div className='f2 fw5 mv2 br3 titleSummary'>Summary</div>;
  }

  return (
    <div className={wrapper}>
      <div>
        <Navigation changeRoute={changeRoute} signOut={signOut} username={user.username} currentPage={pageType}/>
      </div>
      <div className='workBody'>
        {title}
        {itemEditor}
        {
          popup.appear ? 
          <ItemEditor id={popup.id} type={popup.type} onInputChange={onInputChange} 
          onButtonSaveChange={onButtonSaveChange} onButtonCancelChange={onButtonCancelChange} 
          insulateClick={insulateClick} item={input}/> 
          : null
        }
        {list}
      </div>
      <Footer/>
    </div>
  );
  
}

export default Work;
