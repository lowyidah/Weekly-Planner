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
                eventData: function(eventEl) {
                    let durationMilliSeconds;
                    if (parseInt(eventEl.getAttribute("duration")) === 0) {
                        durationMilliSeconds = undefined;
                    }
                    else {
                        durationMilliSeconds = parseInt(eventEl.getAttribute("duration"));
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
                        id: eventEl.getAttribute("id"),
                        dueLocal: eventEl.getAttribute("duelocal"),
                        category: eventEl.getAttribute("category"),
                        borderColor: borderColor,
                        backgroundColor: backgroundColor
                    };
                }
            });
        })
    }, [])


    const eventManipulate = (info) => {
        const eventId = info.event.id;
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
        fetch('http://localhost:3000/transferitem', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: eventId,
                startTime: eventStartTime,
                endTime: eventEndTime,
                hours: durationHours,
                mins: durationMins,
                listTo: 'doingitems'
            })
        })
        .then(loadItems)
        .catch(err => console.log('Error logging into gcal:', err));

        if (new Date(eventEndTime) - Date.now() < 0) {
            calendarRef.current.getApi().getEventById(eventId).setProp('backgroundColor', '#d60000');
            calendarRef.current.getApi().getEventById(eventId).setProp('borderColor', '#d60000');
        }
        else if (category === 'work') {
            calendarRef.current.getApi().getEventById(eventId).setProp('backgroundColor', '#f5511d');
            calendarRef.current.getApi().getEventById(eventId).setProp('borderColor', '#f5511d');
        }
        else if (category === 'errand') {
            calendarRef.current.getApi().getEventById(eventId).setProp('backgroundColor', '#f6c026');
            calendarRef.current.getApi().getEventById(eventId).setProp('borderColor', '#f6c026');
        }
    }

    const eventClick = (eventClickInfo) => {
        openPopup(eventClickInfo.event.id);
    }


    return (
        <div className='w-80 pa3 ma3 br2 calendar'>  
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
                eventReceive={eventManipulate}
                eventResize={eventManipulate}
                eventDrop={eventManipulate}
                //eventDragStop={eventManipulate}
                // ref={this.calendarComponentRef}
                eventClick={(eventClickInfo) => eventClick(eventClickInfo)}
                // selectable={true}
            />   
        </div>
        
    );
     
})

export default Calendargrid;