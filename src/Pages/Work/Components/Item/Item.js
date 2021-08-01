import React from 'react';
import './Item.css'

const Item = ({ id, description, hours, mins, category, onButtonDelete, 
    onButtonTransfer, onButtonReorder, onButtonOpenPopup, due, itemType }) => {

    let color;
    if (category === 'work') {
        color = '#f5511d';
    }
    else if (category === 'errand') {
        color = '#f6bf26'; 
    }

    let duration;
    if (hours === '' && mins === '') {
        duration = null;
    }
    else {
        if (hours === '' && mins !== '') {
            duration =
            <div>
                <span>{0 + " Hours"} </span>
                <span>{mins + " Mins"}</span>
            </div>;
        }
        else if (hours !== '' && mins === '') {
            duration = 
            <div>
                <span>{hours + " Hours"} </span>
                <span>{0 + " Mins"}</span>
            </div>;
        }
        else {
            duration = 
            <div>
                <span>{hours + " Hours"} </span>
                <span>{mins + " Mins"}</span>
            </div>;
        }
    }

    const generateDate = (due) => {
        if (due){
            const dueDate = new Date(due);
                
            let dueHour = dueDate.getHours();
            let amPm = 'am';
            if (dueHour > 11) {
                amPm = 'pm'
            }
            dueHour = dueHour % 12;
            if (dueHour === 0){
                dueHour = 12;
              }

            let dueMin = dueDate.getMinutes();
            if (dueMin < 10) {
                dueMin = '0' + dueMin;
            }

            const dueDateString = dueDate.getDate() + '/' + (dueDate.getMonth()+1) + ', ' + dueHour + 
            ':' + dueMin + amPm;

            return dueDateString;
        } 
    }

    const rightButtons = (itemType) => {
        if (itemType === 'todo') {
            return (
                <div className="rightButtons">   
                    <div className="button deleteButton grow" 
                    onClick={() => onButtonDelete(id, 'item')}>&#10006;</div>
                    <div className="button doButton grow" 
                    onClick={() => onButtonTransfer(id, 'doingitems')}>&#x25B6;</div>
                </div>
            )
        }
        else if (itemType === 'doing') {
            return (
                <div className="rightButtons">   
                    <div className="button deleteButton w-100 grow" 
                    onClick={() => onButtonDelete(id, 'doingitem')}>&#10006;</div>
                    <div className="button doButton  w-100 grow" 
                    onClick={() => onButtonTransfer(id, 'items')}>&#x25C0;</div>
                     <div className="button doneButton  w-100 grow" 
                    onClick={() => onButtonTransfer(id, 'doneitems')}>&#10004;</div>
                </div>
            )
        }
        else if (itemType === 'done') {
            return (
                <div className="rightButtons">   
                    <div className="button deleteButton w-100 grow" 
                    onClick={() => onButtonDelete(id, 'doneitem')}>&#10006;</div>
                    <div className="button doButton  w-100 grow" 
                    onClick={() => onButtonTransfer(id, 'doingitems')}>&#x25C0;</div>
                </div>
            )
        }
    }

    let dueBgColor = null;
    if ((new Date(due) - Date.now() < 86400000) && (due)) {
        dueBgColor = '#f70505';
    }

    return(
        <div className="bg-black-50 mv3 br2 itemBox" style={{backgroundColor: color}}> 
            <div className="arrows">
                <div className="button upArrow grow" 
                onClick={() => onButtonReorder(id, 'up')}>&#x25B2;</div>
                <div className="button downArrow grow" 
                onClick={() => onButtonReorder(id, 'down')}>&#x25BC;</div>
            </div>
            <div className="itemDescription" onClick={() => onButtonOpenPopup(itemType, id)}>   
                <div className=''> {description} </div>
                {duration}
                <div className='br3 pa1' style={{backgroundColor: dueBgColor}}>{generateDate(due)}</div>
            </div>
            {rightButtons(itemType)}
        </div>
    );
}

export default Item;