import React, { useState, useCallback } from 'react';
import Work from './Pages/Work/Work.js';
import HowToUse from './Pages/HowToUse/HowToUse.js';
import './App.css';
import Signin from './Pages/Signin/Signin.js';
import Register from './Pages/Register/Register.js';
import Calendar from './Pages/Calendar/Calendar.js';
import 'tachyons';
import { Switch, Route, useHistory } from "react-router-dom";
// import { useGoogleLogout } from 'react-google-login';
import Particles from 'react-particles-js';

const App = () => {

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
    
    // const clientId="353820592491-bt1jlb4iuf7d8f6f3iu5prh797q08umm.apps.googleusercontent.com";
    // const { signOut } = useGoogleLogout({
    //     clientId
    // })

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
        fetch('http://localhost:3000/profile', {
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
    }, [replaceRoute, history]);
    

    const signOutApp = () => {
        fetch(proccess.env.SERVER_URL + 'signout', {
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
                    <Work  pageType={'summary'} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/errands">
                    <Work pageType={'errands'} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/work">
                    <Work pageType={'work'} reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/calendar">
                    <Calendar reloadUser={reloadUser} changeRoute={changeRoute} user={user} signOut={signOutApp}/>
                </Route>
                <Route path="/register">
                    <Register reloadUser={reloadUser} changeRoute={changeRoute} setUser={setUser}/>
                </Route>
                <Route path="/signin">
                    <Signin reloadUser={reloadUser} replaceRoute={replaceRoute} changeRoute={changeRoute} setUser={setUser}/>
                    {/* <SigninGoogle/> */}
                </Route>
                <Route path="/">
                    <Signin reloadUser={reloadUser} changeRoute={changeRoute} replaceRoute={replaceRoute} setUser={setUser}/>
                </Route>
            </Switch>
        </div>
    );    
}

export default App;

