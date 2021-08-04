import React from 'react';
import './Popup.css'

const Popup = ({ list, details, closePopup, insulateClick, unscheduleItem, 
    finishedItem, eventId, doItem}) => {

    let listButton, removeButton;
    if (list === 'doingitems') {
        removeButton = 
        <div className='unscheduleButtonWrapper'>
            <span className="f6 grow br3 pa2 dib white button mt3 unscheduleButton" 
            onClick={() => {unscheduleItem(eventId); closePopup()}}>Remove from Calendar</span>
        </div>;
        listButton = 
        <div className='completedButtonWrapper'>
            <span className="f6 grow br3 pa2 dib white button mt3 completedButton" 
            onClick={() => {finishedItem(eventId); closePopup()}}>Completed</span>
        </div>
    }
    else if (list === 'doneitems') {
        removeButton = 
        <div className='unscheduleButtonWrapper2'>
            <span className="f6 grow br3 pa2 dib white button mt3 unscheduleButton" 
            onClick={() => {unscheduleItem(eventId); closePopup()}}>Remove from Calendar</span>
        </div>
        listButton = 
        <div className='notCompletedButtonWrapper'>
            <span className="f6 grow br3 pa2 dib white button mt3 notCompletedButton" 
            onClick={() => {doItem(eventId); closePopup()}}>Not Completed</span>
        </div>
    }
    else {
        removeButton = 
        <div className='unscheduleButtonWrapper2'>
            <span className="f6 grow br3 pa2 dib white button mt3 unscheduleButton" 
            onClick={() => {unscheduleItem(eventId); closePopup()}}>Remove from Calendar</span>
        </div>
    }

    return (
        <div className='calPopupBody'>
            <div className='calPopupWrapper' onClick={closePopup}>
                <div className="calPopupWindow bg-black-80 br3" onClick={insulateClick}>
                    <div className='white calPopupDetailsLabel f5 fw5 mb2'>{'Details:'}</div>
                    <textarea className="pa1 br3 bg-white calPopupDetails w-100 h-100" 
                    value={details} readOnly={true}/>
                    {listButton}
                    {removeButton}
                    <div className='closeButtonWrapper'>
                        <span className="f6 grow br3 pb2 dib white underline button" 
                        onClick={closePopup}>Close</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Popup;
