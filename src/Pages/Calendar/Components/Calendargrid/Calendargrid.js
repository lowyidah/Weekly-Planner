import React, {useEffect} from 'react';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import './Calendargrid.css';



const Calendargrid = React.forwardRef(({ events, loadItems, openPopup }, calendarRef) => {
    
    useEffect(() => {
        let draggableEls = document.querySelectorAll(".external-events");
        draggableEls.forEach(draggableEl => {
            new Draggable(draggableEl, {
                itemSelector: ".todo-item",
                eventData: (eventEl) => {
                    let durationMilliSeconds;
                    if (parseInt(eventEl.getAttribute("duration")) === 0) {
                        durationMilliSeconds = undefined;
                    }
                    else {
                        durationMilliSeconds = parseInt(eventEl.getAttribute("duration"));
                    }
                    if (durationMilliSeconds > 10800000) {
                        durationMilliSeconds = 10800000;
                    }

                    let borderColor, backgroundColor;
                     if (eventEl.getAttribute("category") === 'work') {
                        borderColor = '#f5511d';
                        backgroundColor = '#f5511d';
                    }
                    else if (eventEl.getAttribute("category") === 'errand') {
                        borderColor = '#f6c026';
                        backgroundColor = '#f6c026';
                    }
                   
                    return {
                        title: eventEl.getAttribute("title"),
                        duration: durationMilliSeconds,
                        details: eventEl.getAttribute("details"),
                        id: eventEl.getAttribute("id") + " Item",
                        dueLocal: eventEl.getAttribute("duelocal"),
                        category: eventEl.getAttribute("category"),
                        borderColor: borderColor,
                        backgroundColor: backgroundColor
                    };
                }
            });
        })
    }, [])

    const eventManipulate = async (info, action) => {
        const itemId = info.event.id;
        let id;
        const category = info.event.extendedProps.category;
        const eventStartTime = info.event.startStr;
        const eventEndTime = info.event.endStr;
        const durationMilliSeconds = new Date(eventEndTime) - new Date(eventStartTime);
        let durationHours = Math.floor(durationMilliSeconds / 3600000);
        let durationMins = Math.floor((durationMilliSeconds - durationHours * 3600000) / 60000);
        if (durationMilliSeconds === 0) {
            durationHours = '';
            durationMins = '';
        }

        if (action === 'receive') {
            await fetch(process.env.SERVER_URL + 'scheduleitem', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: itemId.split(" ")[0],
                startTime: eventStartTime,
                endTime: eventEndTime,
                hours: durationHours,
                mins: durationMins
            })
            })
            .then(response => response.json())
            .then(idRec => {
                calendarRef.current.getApi().getEventById(itemId).setProp('id', idRec);
                id = idRec;
            })
            .then(loadItems)
            .catch(err => console.log('Error scheduling item:', err));                                          
        }

        else if (action === 'manipulate') {
            id = itemId;
            fetch(process.env.SERVER_URL + 'updatecalendaritem', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: id,
                starttime: eventStartTime,
                endtime: eventEndTime,
                hours: durationHours,
                mins: durationMins,
            })
            })
            .then(loadItems)
            .catch(err => console.log('Error logging into gcal:', err));
        }

        if (new Date(eventEndTime) - Date.now() < 0) {
            calendarRef.current.getApi().getEventById(id).setProp('backgroundColor', '#d60000');
            calendarRef.current.getApi().getEventById(id).setProp('borderColor', '#d60000');
        }
        else if (category === 'work') {
            calendarRef.current.getApi().getEventById(id).setProp('backgroundColor', '#f5511d');
            calendarRef.current.getApi().getEventById(id).setProp('borderColor', '#f5511d');
        }
        else if (category === 'errand') {
            calendarRef.current.getApi().getEventById(id).setProp('backgroundColor', '#f6c026');
            calendarRef.current.getApi().getEventById(id).setProp('borderColor', '#f6c026');
        }

    }

    const eventClick = (eventClickInfo) => {
        openPopup(eventClickInfo.event.id);
    }


    return (
        <div className='calendar'>  
            <FullCalendar
                ref={calendarRef}
                plugins={[ dayGridPlugin, interactionPlugin, timeGridPlugin ]}
                initialView="timeGridWeek"
                events={ events }
                headerToolbar = {
                    {
                        left: 'dayGridMonth,timeGridWeek,timeGridDay',
                        center: 'title',
                        right: 'prev,next'
                    }
                }
                editable='true'
                eventDurationEditable='true'
                eventResizableFromStart='true'
                dayMaxEvents='true' // when too many events in a day, show the popover
                droppable='true'
                forceEventDuration='true'
                eventReceive={info => eventManipulate(info, 'receive')}
                eventResize={info => eventManipulate(info, 'manipulate')}
                eventDrop={info => eventManipulate(info, 'manipulate')}
                //eventDragStop={eventManipulate}
                // ref={this.calendarComponentRef}
                eventClick={(eventClickInfo) => eventClick(eventClickInfo)}
                // selectable={true}
            />   
        </div>
        
    );
     
})

export default Calendargrid;