import React from 'react';
import './Popup.css'

const Popup = ({ list, details, closePopup, insulateClick, unscheduleItem, 
    finishedItem, undoItem, deleteItem, eventId, doItem, dueLocal }) => {

    let buttons;
    if (list === 'doingitems'){
        buttons = <div>
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={() => {finishedItem(eventId); closePopup()}}>Done</span>
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={() => {undoItem(eventId); closePopup()}}>Cancel</span>
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={() => {unscheduleItem(eventId); closePopup()}}>Unschedule</span>
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={() => {deleteItem(eventId); closePopup()}}>Delete</span>
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={closePopup}>Close</span>
        </div>
    }
    else if (list === 'doneitems') {
        buttons = <div>  
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={() => {doItem(eventId); closePopup()}}>Do</span>
            <span className="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-black button" 
            onClick={closePopup}>Close</span>        
        </div>
    }

    return (
        <div className='PopupWrapper fixed' onClick={closePopup}>
            <div className="PopupWindow bg-black-70 br3 pa3" onClick={insulateClick}>
                <div className='w-75 h-75'>
                    <h3 className='white'>{'Details:'}</h3>
                    <textarea className="w-90 h-50 br3 bg-white" value={details} readOnly={true}/>
                </div>
                <div className='w-25 h-75 white'>
                    <h3>{'Due:'}</h3>
                    <div>{dueLocal}</div>
                </div>
                <div className='w-100'>
                    {buttons}
                </div>
            </div>
        </div>
    );
}

export default Popup;
