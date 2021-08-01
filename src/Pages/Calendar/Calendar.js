import React, { useEffect, useState, useCallback } from 'react';
import Navigation from '../../Components/Navigation/Navigation.js';
import './Calendar.css';
import Calendargrid from './Components/Calendargrid/Calendargrid.js';
import Gcal from './Components/Gcal/Gcal.js';
import Itemlist from './Components/Itemlist/Itemlist.js';
import Popup from './Components/Popup/Popup.js';

const Calendar = ({ changeRoute, signOut, user, reloadUser }) => {

    useEffect(() => {
        reloadUser();
    }, [reloadUser]);
    
    const [gcalEvents, setGcalEvents] = useState([]);
    const [items, setItems] = useState([]);
    const [scheduledItems, setScheduledItems] = useState([]);
    const [hasSetScheduledItems, setHasSetScheduledItems] = useState(false);
    const [unscheduledDoingItems, setUnscheduledDoingItems] = useState([]);
    const [events, setEvents] = useState([]);
    let calendarRef = React.createRef();

    const loadScheduledItems = (phase) => {
      fetch('http://localhost:3000/loadscheduleditems', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_id: user.id
          })
        })
      .then(response => response.json())
      .then(scheduledItems => {
        setScheduledItems(scheduledItems.filter(scheduledItem => scheduledItem.starttime !== ''));
        setHasSetScheduledItems(phase);
      })
      .catch(err => console.log('Error loading scheduled items:', err));
    }

    const loadItems = useCallback(() => {
        fetch('http://localhost:3000/loaditems', {
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

        loadScheduledItems('initial', user.id);

        fetch('http://localhost:3000/loaditems', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            user_id: user.id,
            list: 'doingitems'
          })
        })
        .then(response => response.json())
        .then(doing => {
          setUnscheduledDoingItems(doing.filter(doingItem => doingItem.starttime === ''));
        })
        .catch(err => console.log('Error loading doing items:', err));
    }, [user.id]);

    const removeItemFromCalendar = (itemId) => {
      const calendarApi = calendarRef.current.getApi();
      if (calendarApi.getEventById(itemId)) {
          calendarApi.getEventById(itemId).remove();
      }
    }

    const finishedItem = (itemId) => {
      fetch('http://localhost:3000/transferItem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: itemId,
              listTo: 'doneitems'
          })
      })
      .then(loadItems)
      .catch(err => console.log('Error transfering to doneitems:', err));
      calendarRef.current.getApi().getEventById(itemId).setProp('backgroundColor', '#33b679');
      calendarRef.current.getApi().getEventById(itemId).setProp('borderColor', '#33b679');
      calendarRef.current.getApi().getEventById(itemId).setProp('durationEditable', false);
      calendarRef.current.getApi().getEventById(itemId).setProp('startEditable', false);
    }

    const undoItem = (itemId) => {
        removeItemFromCalendar(itemId);
        fetch('http://localhost:3000/transferitem', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: itemId,
                listTo: 'items'
            })
        })
        .then(loadItems)
        .catch(err => console.log('Error transfering to items:', err));
    }

    const deleteItem = (itemId) => {
        removeItemFromCalendar(itemId);
        fetch('http://localhost:3000/deleteitem', {
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
      fetch('http://localhost:3000/transferitem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: itemId,
              listTo: 'doingitems'
          })
      })
      .then(loadItems)
      .catch(err => console.log('Error transfering item to doing list:', err));
      removeItemFromCalendar(itemId);
    }

    const unscheduleItem = (itemId) => {
      fetch('http://localhost:3000/transferitem', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: itemId,
            startTime: '',
            endTime: ''
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

    const [popup, setPopup] = useState({
      appear: false,
      details: '',
      eventId: '',
      list: '',
      dueLocal: ''
    })

    const openPopup = (eventId) => {
      if (calendarRef.current.getApi().getEventById(eventId) && calendarRef.current.getApi().getEventById(eventId).extendedProps.source === 'gcal') {
        let newPopup = Object.assign({}, popup);
        newPopup.appear = true;
        newPopup.details = calendarRef.current.getApi().getEventById(eventId).extendedProps.details;
        newPopup.eventId = eventId;
        newPopup.list = calendarRef.current.getApi().getEventById(eventId).extendedProps.attendance;
        setPopup(newPopup);
      }
      else {
        let item;
        fetch('http://localhost:3000/loaditem', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: eventId,
            })
        })
        .then(response => response.json())
        .then(itemReturned => item = itemReturned)
        .then(() => {
          let newPopup = Object.assign({}, popup);
          newPopup.appear = true;
          newPopup.details = item.details;
          newPopup.eventId = eventId;
          newPopup.list = item.list;
          newPopup.dueLocal = generateDate(item.due);
          setPopup(newPopup);
        })
        .catch(err => console.log('Error loading item'));
      }
    }

    const insulateClick = (event) => {
      event.stopPropagation();
    }

    const closePopup = () => {
      let newPopup = Object.assign({}, popup);
      newPopup.appear = false;
      setPopup(newPopup);
    }

    // concatenating doingEvents to gcalEvents 
    useEffect(() => { 
      const scheduledEvents = scheduledItems.map(scheduledItem => {
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
  }, [gcalEvents, hasSetScheduledItems, scheduledItems])

    return (
        <div>
            <Navigation changeRoute={changeRoute} signOut={signOut} username={user.username} currentPage={'calendar'}/>
            <Gcal setGcalEvents={setGcalEvents} loadScheduledItems={loadScheduledItems} 
            scheduledItems={scheduledItems}/>
            <div className='calendar-wrapper'>
                <Calendargrid ref={calendarRef} gcalEvents={gcalEvents} loadItems={loadItems} events={events}
                hasSetScheduledItems={hasSetScheduledItems} scheduledItems={scheduledItems} openPopup={openPopup}/>
                <div className='w-20'>
                    {
                      popup.appear ? 
                      <Popup list={popup.list} details={popup.details} eventId={popup.eventId} insulateClick={insulateClick} closePopup={closePopup}
                        finishedItem={finishedItem} undoItem={undoItem} deleteItem={deleteItem} doItem={doItem}
                        unscheduleItem={unscheduleItem} dueLocal={popup.dueLocal}
                        /> 
                      : null
                    }
                    <Itemlist generateDate={generateDate}
                    listName={'Todo'} items={items} user={user} loadItems={loadItems} openPopup={openPopup}/>
                    <Itemlist listName={'Unscheduled Doing'} generateDate={generateDate}
                    items={unscheduledDoingItems} user={user} loadItems={loadItems} openPopup={openPopup}/>
                </div>
            </div>
        </div>

    );
}

export default Calendar;