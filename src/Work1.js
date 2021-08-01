import './Work.css';
import React, { Component } from 'react';
import Navigation from '../Navigation/Navigation.js';
import ListInput from './Components/ListInput/ListInput.js';
import ItemList from './Components/ItemList/ItemList.js';
import DoneList from './Components/DoneList/DoneList.js';
import ItemEditor from './Components/ItemEditor/ItemEditor.js';


class Work extends Component {
  
  loadItems() {
    fetch('http://localhost:3000/loaditems', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: this.props.user.id,
        list: 'items'
      })
    })
    .then(response => response.json())
    .then(items => this.setState({items: items}))
    .catch(err => console.log('Error loading items:', err));
  }

  loadDoneItems() {
    fetch('http://localhost:3000/loaditems', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: this.props.user.id,
        list: 'doneitems'
      })
    })
    .then(response => response.json())
    .then(doneItems => this.setState({doneItems: doneItems}))
    .catch(err => console.log('Error loading done items:', err));
  }

  loadAllItems() {
    this.loadItems();
    this.loadDoneItems();
  }

  constructor(props) {
    super(props);
    this.emptyInput = {
      id: '', 
      position: '',
      description: '',
      hours: '',
      mins: '',
      details: ''
    };
    this.state = {
      popup: {
        appear: false,
        id: '',
        type: ''
      },
      input: Object.assign({}, this.emptyInput),
      items: [],
      doneItems: []
    };
    this.props.reloadUser();
    // console.log("this.props.user:", this.props.user);
    // this.loadAllItems();
  }

  onInputChange = (inputType, event) => {
    if(inputType === 'description'){
      let newInput = this.state.input;
      newInput.description = event.target.value;
      this.setState({input: newInput});
    }
    else if(inputType === "hours"){
      let newInput = this.state.input;
      newInput.hours = event.target.value;
      if(newInput.hours === '') {
        newInput.hours = '';
      }
      this.setState({input: newInput});
    }
    else if(inputType === "mins"){
      let newInput = this.state.input;
      newInput.mins = event.target.value;
      if(newInput.mins === '') {
        newInput.mins = '';
      }
      this.setState({input: newInput});
    }
    else if(inputType === "details"){
      let newInput = this.state.input;
      newInput.details = event.target.value;
      this.setState({input: newInput});
    }
  }

  onButtonAdd = () => {
    if (this.state.input.description === ""){
      return;
    }

    fetch('http://localhost:3000/additem', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: this.props.user.id,
        description: this.state.input.description, 
        hours: this.state.input.hours, 
        mins: this.state.input.mins, 
        details: this.state.input.details
      })
    })
    .then(() => this.loadItems())
    .catch(err => console.log('Error adding item:', err));

    this.setState({input: Object.assign({}, this.emptyInput)});
    const inputFields = document.querySelectorAll(".inputField");
    inputFields.forEach(element => {
      element.value = "";
    });
  }

  closePopup = () => {
    let newPopup = this.state.popup;
    newPopup.appear = false;
    this.setState({popup: newPopup});
  }

  onButtonSaveChange = (type) => {

    let newItem = Object.assign({}, this.state.input);

    fetch('http://localhost:3000/edititem', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        editedItem: newItem
      })
    })
    .then(() => {
      if (type === 'item') {
        this.loadItems();
      }
      else if (type === 'done') {
        this.loadDoneItems();
      }
    })
    .catch(err => console.log('Error saving edit:', err));

    this.setState({input: Object.assign({}, this.emptyInput)});
    this.closePopup();
  }

  onButtonCancelChange = () => {
    this.setState({input: Object.assign({}, this.emptyInput)});
    this.closePopup();
  }

  insulateClick = (event) => {
    event.stopPropagation();
  }

  onButtonDelete = (id, type) => {
    fetch('http://localhost:3000/deleteitem', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: id
      })
    })
    .then(() => {
      if (type === 'item') {
        this.loadItems();
      }
      else if (type === 'doneitem') {
        this.loadDoneItems();
      }
    })
    .catch(err => console.log('Error deleting item:', err));
  }

  onButtonTransfer = (id, type) => {
    let listTo;
    if(type === 'done'){
      listTo = 'doneitems';
    }
    else if (type === 'undo') {
      listTo = 'items';
    }
    fetch('http://localhost:3000/transferitem', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: id,
        listTo: listTo
      })
    })
    .then(() => this.loadAllItems())
    .catch(err => console.log('Error transfering item to other list:', err));
  }

  onButtonReorder = (id, direction) => {
    fetch('http://localhost:3000/reorderitems', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: this.props.user.id,
        id: id,
        direction: direction
      })
    })
    .then(() => this.loadItems())
    .catch(err => console.log('Error reordering items:', err));
  }

  onButtonEdit = (type, id) => {
    let newPopup = this.state.popup;
    newPopup.appear = true;
    newPopup.id = id;
    newPopup.type = type;
    this.setState({popup: newPopup});
    let newInput;
    if(type === 'item') {
      newInput = Object.assign({}, this.state.items.filter(item => item.id === id)[0]);
    }
    else if(type === 'done') {
      newInput = Object.assign({}, this.state.doneItems.filter(item => item.id === id)[0]);
    }
    this.setState({input: newInput});
  }  

  // componentDidUpdate(prevProps) { 
  //   if(this.props.user.id !== prevProps.user.id) {
  //     this.loadAllItems();
  //   }
  // }

  render() {
    return (
      <div className='App'>
        <Navigation changeRoute={this.props.changeRoute} signOut={this.props.signOut} username={this.props.user.username}/>
        <ListInput onInputChange={this.onInputChange} onButtonAdd={this.onButtonAdd}/>
        <div className='Lists w-100'> 
          {
            this.state.popup.appear ? 
            <ItemEditor id={this.state.popup.id} type={this.state.popup.type} onInputChange={this.onInputChange} 
            onButtonSaveChange={this.onButtonSaveChange} onButtonCancelChange={this.onButtonCancelChange} 
            insulateClick={this.insulateClick} item={this.state.input}/> 
            : null
          }
          <ItemList items={this.state.items} onButtonEdit={this.onButtonEdit} onButtonReorder={this.onButtonReorder}
          onButtonTransfer={this.onButtonTransfer} onButtonDelete={this.onButtonDelete}/>
          <DoneList doneItems={this.state.doneItems} onButtonTransfer={this.onButtonTransfer} 
          onButtonDelete={this.onButtonDelete} onButtonEdit={this.onButtonEdit}/>
        </div>
        {/* 
        <ListofItems/> */}
      </div>
    );
  }
}

export default Work;
