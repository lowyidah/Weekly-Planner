import React, { useEffect, useState, useCallback } from 'react';
import Navigation from '../../Components/Navigation/Navigation.js';
import Footer from '../../Components/Footer/Footer.js';
import './Calendar.css';
import Calendargrid from './Components/Calendargrid/Calendargrid.js';
import Gcal from './Components/Gcal/Gcal.js';
import Itemlist from './Components/Itemlist/Itemlist.js';
import Popup from './Components/Popup/Popup.js';
import ItemEditor from '../../Components/ItemEditor/ItemEditor.js';

const Calendar = ({ changeRoute, signOut, user, reloadUser, backendUrl }) => {
    useEffect(() => {
        reloadUser();
    }, [reloadUser]);
    
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
    const [gcalEvents, setGcalEvents] = useState([]);
    const [items, setItems] = useState([]);
    const [doingItems, setDoingItems] = useState([]);
    const [calendarItems, setCalendarItems] = useState([]);
    const [hasSetCalendarItems, setHasSetCalendarItems] = useState(false);
    const [events, setEvents] = useState([]);
    let calendarRef = React.createRef();

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

    const closePopup = () => {
      let newPopup = popup;
      newPopup.appear = false;
      setPopup(newPopup);
    }
    
    const onButtonEdit = (id, type) => {
      let newPopup = popup;
      newPopup.appear = true;
      newPopup.id = id;
      newPopup.type = type;
      setPopup(newPopup);
      let newInput;
      if(type === 'todo') {
        newInput = Object.assign({}, items.filter(item => item.id === id)[0]);
      }
      else if(type === 'doing') {
        newInput = Object.assign({}, doingItems.filter(item => item.id === id)[0]);
      }
      setInput(newInput);
    }  

    const onButtonSaveChange = () => {

      let newItem = Object.assign({}, input);
  
      fetch(backendUrl + '/edititem', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          editedItem: newItem
        })
      })
      .then(() => {
        loadItems();
      })
      .catch(err => console.log('Error saving edit:', err));
  
      setInput(Object.assign({}, emptyInput));
      closePopup();
    }

    const onButtonCancelChange = () => {
      setInput(Object.assign({}, emptyInput));
      closePopup();
    }


    const loadCalendarItems = useCallback((phase) => {
      fetch(backendUrl + '/loadcalendaritems', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_id: user.id
          })
        })
      .then(response => response.json())
      .then(calendarItems => {
        setCalendarItems(calendarItems.filter(scheduledItem => scheduledItem.starttime !== ''));
        setHasSetCalendarItems(phase);
      })
      .catch(err => console.log('Error loading scheduled items:', err));
    }, [user.id, backendUrl])

    const loadItems = useCallback(() => {
        loadCalendarItems('initial', user.id);
        fetch(backendUrl + '/loaditems', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_id: user.id,
            list: 'items'
          })
        })
        .then(response => response.json())
        .then(items => setItems(items))
        .catch(err => console.log('Error loading items:', err));

        fetch(backendUrl + '/loaditems', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_id: user.id,
            list: 'doingitems'
          })
        })
        .then(response => response.json())
        .then(items => setDoingItems(items))
        .catch(err => console.log('Error loading items:', err));
    }, [user.id, loadCalendarItems, backendUrl]);

    const removeItemFromCalendar = (itemId) => {
      const calendarApi = calendarRef.current.getApi();
      if (calendarApi.getEventById(itemId)) {
          calendarApi.getEventById(itemId).remove();
      }
    }

    const finishedItem = (id) => {
      fetch(backendUrl + '/transfercalendaritem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: id,
              list: 'doneitems'
          })
      })
      .then(loadItems)
      .catch(err => console.log('Error transfering to doneitems:', err));
      calendarRef.current.getApi().getEventById(id).setProp('backgroundColor', '#33b679');
      calendarRef.current.getApi().getEventById(id).setProp('borderColor', '#33b679');
      calendarRef.current.getApi().getEventById(id).setProp('durationEditable', false);
      calendarRef.current.getApi().getEventById(id).setProp('startEditable', false);
      console.log('calendarRef: ', calendarRef)
    }

    const finishedBatchItem = (itemId) => {
      fetch(backendUrl + '/transferitem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: itemId,
              listTo: 'doneitems'
          })
      })
      .then(response => response.json())
      .then(ids => {
        console.log('ids: ', ids)
        ids.forEach(idObj => {
          console.log('calendarRef: ', calendarRef)
          calendarRef.current.getApi().getEventById(idObj.id).setProp('backgroundColor', '#33b679');
          calendarRef.current.getApi().getEventById(idObj.id).setProp('borderColor', '#33b679');
          calendarRef.current.getApi().getEventById(idObj.id).setProp('durationEditable', false);
          calendarRef.current.getApi().getEventById(idObj.id).setProp('startEditable', false);
        })
      })
      .then(loadItems)
      .then(closePopup)
      .catch(err => console.log('Error transfering to doneitems:', err));
      console.log('calendarRef: ', calendarRef)
    }

    const todoItem = (id) => {
      fetch(backendUrl + '/transferitem', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: id,
          listTo: 'items'
        })
      })
      .then(() => loadItems())
      .catch(err => console.log('Error transfering item to todo list:', err));
    }


    const deleteItem = (itemId) => {
        removeItemFromCalendar(itemId);
        fetch(backendUrl + '/deleteitem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: itemId
            })
        })
        .then(loadItems)
        .catch(err => console.log('Error deleting item:', err));
    }

    const doItem = (itemId) => {
      fetch(backendUrl + '/transfercalendaritem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: itemId,
              list: 'doingitems'
          })
      })
      .then(loadItems)
      .catch(err => console.log('Error transfering item to doing list:', err));
    }

    const unscheduleItem = (itemId) => {
      fetch(backendUrl + '/deletecalendaritem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: itemId
          })
      })
      .then(loadItems)
      .catch(err => console.log('Error unscheduling item', err));
      removeItemFromCalendar(itemId);
    }

    const generateDate = (due) => {
      if (due){
          const dueDate = new Date(due);
              
          let dueHour = dueDate.getHours();
          let amPm = 'am';
          if (dueHour > 11) {
              amPm = 'pm'
          }
          dueHour = dueHour % 12;
          if (dueHour === 0){
            dueHour = 12;
          }

          let dueMin = dueDate.getMinutes();
          if (dueMin < 10) {
              dueMin = '0' + dueMin;
          }

          const dueDateString = dueDate.getDate() + '/' + (dueDate.getMonth()+1) + ', ' + dueHour + 
          ':' + dueMin + amPm;

          return dueDateString;
      } 
  }

    const [calPopup, setCalPopup] = useState({
      appear: false,
      details: '',
      eventId: '',
      list: ''
    })

    const openCalPopup = (eventId) => {
      if (calendarRef.current.getApi().getEventById(eventId) && calendarRef.current.getApi().getEventById(eventId).extendedProps.source === 'gcal') {
        let newCalPopup = Object.assign({}, calPopup);
        newCalPopup.appear = true;
        newCalPopup.details = calendarRef.current.getApi().getEventById(eventId).extendedProps.details;
        newCalPopup.eventId = eventId;
        newCalPopup.list = calendarRef.current.getApi().getEventById(eventId).extendedProps.attendance;
        setCalPopup(newCalPopup);
      }
      else {
        let item;
        fetch(backendUrl + '/loadcalendaritem', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: eventId,
            })
        })
        .then(response => response.json())
        .then(itemReturned => item = itemReturned)
        .then(() => {
          let newCalPopup = Object.assign({}, popup);
          newCalPopup.appear = true;
          newCalPopup.details = item.details;
          newCalPopup.eventId = eventId;
          newCalPopup.list = item.list;
          setCalPopup(newCalPopup);
        })
        .catch(err => console.log('Error loading item'));
      }
    }

    const insulateClick = (event) => {
      event.stopPropagation();
    }

    const closeCalPopup = () => {
      let newCalPopup = Object.assign({}, calPopup);
      newCalPopup.appear = false;
      setCalPopup(newCalPopup);
    }

    // concatenating doingEvents to gcalEvents 
    useEffect(() => { 
      const scheduledEvents = calendarItems.map(scheduledItem => {
        let backgroundColor, borderColor;
        if ((new Date(scheduledItem.endtime) - Date.now() < 0) && (scheduledItem.list === 'doingitems')) {
            backgroundColor = '#d60000';
            borderColor = '#d60000';
        }
        else if (scheduledItem.list === 'doneitems'){
            backgroundColor = '#33b679';
            borderColor = '#33b679';
        }
        else if (scheduledItem.category === 'work') {
            backgroundColor = '#f5511d';
            borderColor = '#f5511d';
        }
        else if (scheduledItem.category === 'errand') {
            backgroundColor = '#f6c026';
            borderColor = '#f6c026';
        }

        let durationEditable = true, startEditable = true;
        if (scheduledItem.list === 'doneitems') {
            durationEditable = false;
            startEditable = false;
        }

        return {
            title: scheduledItem.description,
            details: scheduledItem.details,
            start: scheduledItem.starttime,
            end: scheduledItem.endtime,
            id: scheduledItem.id,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            source: 'db',
            category: scheduledItem.category,
            durationEditable: durationEditable,
            startEditable: startEditable
            //creator: 
        }
      }); 
      setEvents([].concat(gcalEvents, scheduledEvents));
      calendarRef.current.getApi().getEvents().forEach(event => {
          calendarRef.current.getApi().getEventById(event.id).remove();
      })
  }, [gcalEvents, hasSetCalendarItems, calendarItems, backendUrl])

    return (
        <div className='calendarPageWrapper'>
          <Navigation changeRoute={changeRoute} signOut={signOut} username={user.username} currentPage={'calendar'}/>
          {
            calPopup.appear ? 
            <Popup list={calPopup.list} details={calPopup.details} eventId={calPopup.eventId} insulateClick={insulateClick} 
            closePopup={closeCalPopup} finishedItem={finishedItem}
            doItem={doItem} unscheduleItem={unscheduleItem} finishedBatchItem={finishedBatchItem}
              /> 
            : null
          }
          {
            popup.appear ? 
            <ItemEditor id={popup.id} type={popup.type} onInputChange={onInputChange} 
            onButtonSaveChange={onButtonSaveChange} onButtonCancelChange={onButtonCancelChange} 
            insulateClick={insulateClick} item={input} finishedBatchItem={finishedBatchItem}
            todoItem={todoItem} deleteItem={deleteItem}
            /> 
            : null
          }
          <div className='calendarBodyWrapper'>
            <div className='GcalWrapper'>
              <Gcal backendUrl={backendUrl} setGcalEvents={setGcalEvents} loadCalendarItems={loadCalendarItems} 
              calendarItems={calendarItems}/>
            </div>
            <div className='CalendargridWrapper'>
              <Calendargrid backendUrl={backendUrl} ref={calendarRef} loadItems={loadItems} events={events}
              openPopup={openCalPopup}/>
            </div>
            <div className='ItemListsWrapper'>
              <Itemlist generateDate={generateDate}
              listType={'todo'} items={items} user={user} loadItems={loadItems} openPopup={onButtonEdit}/>
              <Itemlist listType={'doing'} generateDate={generateDate}
              items={doingItems} user={user} loadItems={loadItems} openPopup={onButtonEdit}/>
            </div>
          </div>
          <Footer/>
        </div>
    );
}

export default Calendar;