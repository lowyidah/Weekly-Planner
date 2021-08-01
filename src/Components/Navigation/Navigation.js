import React from 'react';
import './Navigation.css';

const Navigation = ({ signOut, username, changeRoute, currentPage }) => {
    let summaryStyle, workStyle, errandsStyle, calendarStyle, howtouseStyle;
    const selected = {
        fontWeight: '450',
        fontSize: '1.2rem'
    }
    if(currentPage === 'summary') {
        summaryStyle = selected;
    }
    else if(currentPage === 'work') {
        workStyle = selected;
    }
    else if(currentPage === 'errands') {
        errandsStyle = selected;
    }
    else if(currentPage === 'calendar') {
        calendarStyle = selected;
    }
    else if(currentPage === 'howtouse'){
        howtouseStyle = selected;
    }

    return (
        <div className="bg-black-50 navigationBar">
                <span onClick={() => changeRoute('/summary')} 
                className="link dim white dib button" title="Summary" style={summaryStyle}>Summary</span>
                <span onClick={() => changeRoute('/work')} 
                className="link dim white dib button" title="Work" style={workStyle}>Work</span>
                <span onClick={() => changeRoute('/errands')} 
                className="link dim white dib button" title="Errands" style={errandsStyle}>Errands</span>
                <span onClick={() => changeRoute('/calendar')} 
                className="link dim white dib button" title="Calendar" style={calendarStyle}>Calendar</span>
                <span/>
                <span onClick={() => changeRoute('/howtouse')} 
                className="link dim white dib button" title="Calendar" style={howtouseStyle}>How To Use</span>
                <span className="link dim white dib button" title="Calendar" 
                onClick={signOut}>Sign Out</span>
                <span className="white fw1 i">Welcome, {username}</span> 
        </div>
    )
}

export default Navigation;