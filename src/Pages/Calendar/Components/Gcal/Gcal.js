import React, { useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import './Gcal.css';

const Gcal = ({ setGcalEvents, scheduledItems, loadScheduledItems }) => {

    const [email, setEmail] = useState('');
    const [accessToken, setAccessToken] = useState('');

    const saveToGcal = () => {
        const gcalEvents = scheduledItems.map(scheduledItem => {
            let colorId;
            if ((new Date(scheduledItem.endtime) - Date.now() < 0) && (scheduledItem.list === 'doingitems')) {
                colorId = '11';
            }
            else if (scheduledItem.list === 'doneitems'){
                colorId = '2';
            }
            else if (scheduledItem.category === 'work') {
                colorId = '6';
            }
            else if (scheduledItem.category === 'errand') {
                colorId = '5';
            }

            return {
                'summary': scheduledItem.description,
                'description': scheduledItem.details,
                'start': {
                    'dateTime': scheduledItem.starttime
                },
                'end': {
                    'dateTime': scheduledItem.endtime
                },
                'colorId': colorId,
                "extendedProperties": {
                    "private": {
                    "weeklyPlannerEvent": "yes",
                    "id": scheduledItem.id
                    }
                }
            }
        })

        fetch('http://localhost:3000/savetogcal', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                accessToken: accessToken,
                events: gcalEvents
            })
        })
        .catch(err => console.log('Error saving to gcal:', err));
    }

    const responseGoogle = (response) => {
        setAccessToken(response.accessToken);

        setEmail(response.profileObj.email);
        fetch('http://localhost:3000/signincalendar', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                accessToken: response.accessToken,
            })
        })
        .then(response => response.json())
        .then(res => {
            // set gcalEvents
            let backgroundColor, textColor;
            const gcalEvents = res.map(event => {
                if (event.attendance === 'accepted' || event.attendance === 'tentative') {
                    textColor = '#FFFFFF'
                    backgroundColor = '#039BE5';
                }
                else if (event.attendance === 'needsAction') {
                    textColor = '#039BE5'
                    backgroundColor = '#FFFFFF';
                }
                return {
                    title: event.title,
                    details: event.details,
                    start: event.start,
                    end: event.end,
                    id: event.id,
                    attendance: event.attendance,
                    backgroundColor: backgroundColor,
                    borderColor: '#039BE5',
                    textColor: textColor,
                    source: 'gcal',
                    resourceEditable: false,
                    startEditable: false,
                    durationEditable: false
                }
            })
            setGcalEvents(gcalEvents);
        })
        .catch(err => console.log('Error logging into gcal:', err));
    }

    const onButtonSync = () => {
        fetch('http://localhost:3000/syncfromgcal', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                accessToken: accessToken
            })
        })
        .then(() => loadScheduledItems(Date.now()))
        .catch(err => console.log('Error updating items:', err));
    }

    const logoutSuccess = () => {
        setGcalEvents([]);
        setEmail('');
    }

    // const responseGoogle1 = (response) => {
    //     console.log(response)
    //     fetch('http://localhost:3000/signincalendar', {
    //         method: 'post',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify({
    //             code: response.code,
    //         })
    //     })
    // }


    return (
        <div className='mh3 mv1 ph3 pv1 gcal-wrapper'>
            <div className='w-50'>
                {
                    email === '' ?
                    <GoogleLogin
                    clientId="353820592491-bt1jlb4iuf7d8f6f3iu5prh797q08umm.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                    scope='https://www.googleapis.com/auth/calendar'
                    // responseType='code'
                    // accessType='offline'
                    // prompt='consent'
                    // approvalPrompt='force'
                    /> :
                    <GoogleLogout
                    clientId="353820592491-bt1jlb4iuf7d8f6f3iu5prh797q08umm.apps.googleusercontent.com"
                    buttonText="Logout"
                    onLogoutSuccess={logoutSuccess}
                    scope='https://www.googleapis.com/auth/calendar'
                    />
                }
            </div>
            <div className='w-50'>
                <h4>
                    {
                        email === '' ? 
                        'You are not signed into google calendar' :
                        ('You are signed into google calendar as ' + email)
                    }
                </h4>
                <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
                onClick={onButtonSync}>Sync changes from gcal</span>
                <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
                onClick={saveToGcal}>Save to gcal</span>
            </div>
        </div>
    );
}

export default Gcal;