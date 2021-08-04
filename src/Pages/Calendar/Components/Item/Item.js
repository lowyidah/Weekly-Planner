import React from 'react';
import './Item.css';

const Item = ({ item, i, openPopup, listType, durationFunc, generateDate }) => {
    let icon = null;
    if (item.starttime) {
        icon = <img src='to-do-list.png' alt='' className='calIcon'/>;
    }

    let durationMilliSeconds;
    if(!item.hours && !item.mins){
        durationMilliSeconds = 0;
    }
    else {
        durationMilliSeconds = item.hours * 3600000 + item.mins * 60000;
    }

    let bgColor;
    if (item.category === 'work') {
        bgColor = '#f5511d';
    }
    else if (item.category === 'errand') {
        bgColor = '#f6c026';
    }

    let dueBgColor = null;
    if ((new Date(item.due) - Date.now() < 86400000) && (item.due)) {
        dueBgColor = '#e30000';
    }

    const dueLocal = generateDate(item.due);
    
    return (
        <div
            style={{backgroundColor: bgColor}}
            className="todo-item button w-100 calItemBox br1"
            title={item.description}
            duration={durationMilliSeconds}
            details={item.details}
            id={item.id}
            list={item.list}
            key={i}
            category={item.category}
            duelocal={dueLocal}
            onClick={() => openPopup(item.id, listType)}
        >
            <div className='calIconWrapper'>{icon}</div>
            <div className='calItemDescription'>{item.description}</div>
            <div className='calDue'>
                <div className='br1 dib' style={{backgroundColor: dueBgColor}}>{dueLocal} </div>
            </div>
            <div className='calDuration'>{durationFunc(item.hours, item.mins)}</div>
        </div>
    );
}

export default Item;