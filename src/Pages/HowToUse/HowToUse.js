import React, { useEffect } from 'react';
import Navigation from '../../Components/Navigation/Navigation.js';
import Footer from '../../Components/Footer/Footer.js';
import './HowToUse.css';


const HowToUse = ({ reloadUser, changeRoute, user, signOut }) => {
    useEffect(() => {
        reloadUser();
    }, [reloadUser]);


    return (
        <div className='howtouseWrapper'>
            <Navigation changeRoute={changeRoute} signOut={signOut} username={user.username} currentPage={'howtouse'}/>
            <div className='ma4 howtouseBodyWrapper'>
                <div className='welcomeMessage fw5 white'> 
                    Welcome to Weekly Planner, a place where you are able to easily map out your week!
                </div>
                <div className=' br3 explanationBox white note'> 
                    Note: This website is intended to be used on Google Chrome (Desktop). Usage on other browsers / mobile
                        will diminish the user experience.
                </div>
                <div className='bg-black-50 br3 explanationBox white'> 
                    <div className='f3 fw5 pb3'>Work and Errands</div>
                    <div className='f5 fw4'>
                        Begin by entering your tasks at either the "Work" page or "Errands" page. After entering each task, 
                        you will be able to edit each task and view additional details by clicking on it. You are also able to toggle
                        each task between the "Todo", "Doing" and "Done" lists, and reorder them. Tasks with their due times
                        highlighted in red signify that there are less than 24 hours left to complete them.
                    </div>
                </div>
                <div className='bg-black-50 br3 explanationBox white'> 
                    <div className='f3 fw5 pb3'>Summary</div>
                    <div className='f5 fw4'>
                        Both "work" and "errands" that have yet to be done or are currently being executed
                        will be displayed on this page. This page is intended as a summary and is not meant
                        for the adding of tasks. However, you will be able to edit each task and view additional details
                        by clicking on it. You are also able to
                        toggle each task between the "Todo", "Doing" and "Done" lists, and reorder them.
                        Tasks with their due times highlighted signify that there are less than 24 hours left to complete them.
                    </div>
                </div>
                <div className='bg-black-50 br3 explanationBox white'> 
                    <div className='f3 fw5 pb3'>Calendar</div>
                    <div className='f5 fw4 '>
                        <div className='f5 fw5 pb2 underline'>Scheduling to Calendar</div>
                        <div className='f5 fw4 pb3'>
                            Schedule tasks by dragging from the "To Do" or "Doing" lists onto the calendar grid. After scheduling an event
                            on the calendar, you are able to move or extend it. All tasks
                            that are scheduled will be in the "Doing" list. Once the task has been placed on the calendar grid, 
                            an icon will appear on the left of the task in the "Doing" list. You are able to schedule multiple events corresponding to a
                            single task should you choose to break up each task. 
                        </div>

                        <div className='f5 fw5 pb2 underline'>Events on Calendar</div>
                        <div className='f5 fw4 pb3'>
                            Click on each event in the calendar to view additional details on it, toggle it between completed and not completed,
                            and remove it from the calendar. Completed events are green and incomplete events whose due times have been passed are red. 
                            If all events in the calendar belonging to a single task are removed, the icon on the right of 
                            the task in the "Doing" list disappears. Similarly, if all events in the calendar belonging to a single task are 
                            completed, the task is moved from the "Doing" list to the "Done" list.
                        </div>

                        <div className='f5 fw5 pb2 underline'>Tasks on Lists</div>
                        <div className='pb3 calendarBox'>
                            Click on each task in the "To Do" or "Doing" lists to view additional details, edit the task, and delete, complete or
                            revert it to the "To Do" list. 
                            When a task is deleted, all corresponding events on the calendar grid that are not
                            completed will be deleted. Similarly, when a task is completed, all corresponding events on the calendar grid are 
                            considered completed and turn green. Also, when a task is placed back in the "To Do" list, all corresponding events on the calendar 
                            grid that are not completed are removed. Similar actions taken on tasks in the other pages will have the same effects on
                            events in the calendar grid. Tasks with their due times
                            highlighted signify that there are less than 24 hours left to complete them. 
                        </div>

                        <div className='f5 fw5 pb2 underline'>*Sync with Google Calendar</div>
                        <div className='pb3'>
                            You are able to log into your google account to view the events from your google calendar on this website. Do note that only 
                            events from your "primary" google calendar are reflected on this website's calendar. After logging into your
                            google account, click the "Sync to Google Calendar" button to save your events to your google calendar. You may have to refresh your
                            google calendar website/app for the events to show up. If you edit event timings on your google calendar, you are able to
                            sync the timing changes with this website by clicking the "Sync from Google Calendar" button.
                        </div>
                        <div className='f7 pt3'>
                           *The Google Calendar syncing function is currently not fully published, hence your google account
                           email has to be manually added in the back end for you to gain access to the syncing function.
                           Please send your google email address to lowyidahcs@gmail.com 
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default HowToUse;

