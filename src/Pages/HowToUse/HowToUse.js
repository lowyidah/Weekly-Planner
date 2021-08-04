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
                <div className='welcomeMessage fw5 explanationBox white'> 
                    Welcome to Weekly Planner, a place where you are able to easily map out your week!
                </div>
                <div className='bg-black-50 br3 explanationBox white'> 
                    <div className='f4 fw5 pb3'>Work and Errands</div>
                    <div className='f5 fw4'>
                        Begin by entering your tasks at either the "Work" page or "Errand" page. After entering each task, 
                        you will be able to edit each item at any time by clicking on it. You are also able to toggle
                        each item between the "Todo", "Doing" and "Done" statuses. Tasks with their due times
                        highlighted signify that there are less than 24 hours left to complete them.
                    </div>
                </div>
                <div className='bg-black-50 br3 explanationBox white'> 
                    <div className='f4 fw5 pb3'>Summary</div>
                    <div className='f5 fw4'>
                        Both "work" and "errands" that have yet to be done or are currently being executed
                        will be displayed on this page. This page intended as a summary and not is not meant
                        for the adding or editing of tasks. Tasks with their due times
                        highlighted signify that there are less than 24 hours left to complete them.
                    </div>
                </div>
                <div className='bg-black-50 br3 explanationBox white'> 
                    <div className='f4 fw5 pb3'>Calendar</div>
                    <div className='f5 fw4'>
                        <div className='pb3'>
                            Plan out your week by dragging and dropping both "work" and "errands" that have yet to be done or are currently being executed onto a calendar. 
                            Before dropping a task onto the calendar, click on it for additional details on the task. Tasks with their due times
                            highlighted signify that there are less than 24 hours left to complete them. After dropping a task onto the
                            calendar, you are able to change its start time and duration by either dragging or extending it. Click on the 
                            scheduled task to view additional details, change its status (Todo, Doing, Done) or unschedule it. If an item is green it is completed, and
                            if red it is pass its due date but not completed.
                        </div>
                        <div>
                            You are able to log into your google account to view the events from google calendar on this website. Do note that only 
                            items from your "primary" google calendar are reflected on this website's calendar. After logging into your
                            google account, click "Save to Gcal" to save your tasks to your google calendar. You may have to refresh your
                            google calendar website/app for the tasks to show up. If you edit tasks on your google calendar, you are able to
                            sync the changes with this website by clicking "Sync Changes from Gcal".
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default HowToUse;

