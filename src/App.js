import React, { useState, useCallback } from 'react';
import Work from './Pages/Work/Work.js';
import HowToUse from './Pages/HowToUse/HowToUse.js';
import './App.css';
import Signin from './Pages/Signin/Signin.js';
import Register from './Pages/Register/Register.js';
import Calendar from './Pages/Calendar/Calendar.js';
import 'tachyons';
import { Switch, Route, useHistory } from "react-router-dom";
import Particles from 'react-particles-js';

const App = ({backendUrl}) => {

    const particlesOptions = {
        particles: {
          number: {
            value: 15,
            density: {
              enable: true,
              value_area: 200
            }
          }
        }
      }
    

    let history = useHistory();
    const [user, setUser] = useState('');

    const changeRoute = useCallback((newRoute) => {
        if(history.location.pathname !== newRoute){
            history.push(newRoute);
        }
    }, [history]);

    const replaceRoute = useCallback((newRoute) => {
        if(history.location.pathname !== newRoute){
            history.replace(newRoute);
        }
    }, [history]);

    const reloadUser = useCallback(() => {
        fetch(backendUrl + '/profile', {
            method: 'post', 
            credentials: 'include'
        })
        .then(response => response.json())
        .then(userSignedin => {
            if (userSignedin === "You are not logged in" && history.location.pathname === '/register') {
                return;
            }
            else if (userSignedin === "You are not logged in") {
                setUser('');
                replaceRoute('/signin');

            }
            else if ((history.location.pathname === '/register' || history.location.pathname === '/signin'
            || history.location.pathname === '/')) {
                setUser(userSignedin);
                replaceRoute('/summary');
            }
            else {
                setUser(userSignedin);
            }
        })
        .catch(() => console.log("Unable to retrieve user profile"));
    }, [replaceRoute, history, backendUrl]);
    
    const signOutApp = () => {
        fetch(backendUrl + '/signout', {
            method: 'post',
            credentials: 'include'
        })
        .catch(() => console.log('Unable to sign out'));
        changeRoute('/signin');
        //signOut();
    }

    return(
        <div className='websiteBody'>
            <Particles className="particles"
            params={particlesOptions}
            />
            <Switch>
                <Route path="/howtouse">
                    <HowToUse reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/summary">
                    <Work backendUrl={backendUrl} pageType={'summary'} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/errands">
                    <Work backendUrl={backendUrl} pageType={'errands'} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/work">
                    <Work backendUrl={backendUrl} pageType={'work'} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/calendar">
                    <Calendar backendUrl={backendUrl} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/register">
                    <Register backendUrl={backendUrl} reloadUser={reloadUser} changeRoute={changeRoute} setUser={setUser}/>
                </Route>
                <Route path="/signin">
                    <Signin backendUrl={backendUrl} reloadUser={reloadUser} replaceRoute={replaceRoute} changeRoute={changeRoute} setUser={setUser}/>
                    {/* <SigninGoogle/> */}
                </Route>
                <Route path="/">
                    <Signin backendUrl={backendUrl} reloadUser={reloadUser} changeRoute={changeRoute} replaceRoute={replaceRoute} setUser={setUser}/>
                </Route>
            </Switch>
        </div>
    );    
}

export default App;

