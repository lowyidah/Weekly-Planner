import React, { useEffect } from 'react';

const Itemlist = ({ listName, user, loadItems, items, openPopup, generateDate }) => {

    useEffect(() => {
        if (user) {
            loadItems();
        }
    }, [loadItems, user])

    const duration = (hours, mins) => {
        let duration;
        if (hours === '' && mins === '') {
            duration = null;
        }
        else {
            if (hours === '' && mins !== '') {
                duration =
                <div>
                    <span>{0 + "h"} </span>
                    <span>{mins + "m"}</span>
                </div>;
            }
            else if (hours !== '' && mins === '') {
                duration = 
                <div>
                    <span>{hours + "h"} </span>
                    <span>{0 + "m"}</span>
                </div>;
            }
            else {
                duration = 
                <div>
                    <span>{hours + "h"} </span>
                    <span>{mins + "m"}</span>
                </div>;
            }
        }
        return duration;
    }

    return (
        <div className='external-events w-100 pa2 ma2'>
            <h2> {listName} </h2>
            {items.map((item, i) => {
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
                    dueBgColor = '#f70505';
                }
                
                const dueLocal = generateDate(item.due);
                return (
                <div
                    style={{backgroundColor: bgColor}}
                    className="todo-item bg-black-50 br1 ma1 pa1 button"
                    title={item.description}
                    duration={durationMilliSeconds}
                    details={item.details}
                    id={item.id}
                    list={item.list}
                    key={i}
                    category={item.category}
                    duelocal={dueLocal}
                    onClick={() => openPopup(item.id)}
                >
                    <div className='w-100'>{item.description}</div>
                    <div className='flex'>
                        <div className='w-70' style={{backgroundColor: dueBgColor}}>{dueLocal} </div>
                        <div className='w-30'>{duration(item.hours, item.mins)}</div>
                    </div>
                </div>
                );
            })}
        </div>
    );
}

export default Itemlist;