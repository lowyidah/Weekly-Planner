import React, { useEffect } from 'react';
import Item from '../Item/Item.js';
import './Itemlist.css'

const Itemlist = ({ listType, user, loadItems, items, openPopup, generateDate }) => {

    useEffect(() => {
        if (user) {
            loadItems();
        }
    }, [loadItems, user])

    let listName;
    if (listType === 'todo') {
        listName = "To Do";
    }
    else if (listType === 'doing') {
        listName = 'Doing';
    }

    const durationFunc = (hours, mins) => {
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
        <div className='bg-black-50 calItemList mb2 br2 external-events'>
            <div className="f3 fw6 white calListName"> {listName} </div>
            {items.map((item, i) => {
                return <Item item={item} i={i} openPopup={openPopup}
                listType={listType} durationFunc={durationFunc} generateDate={generateDate}/>
            })}
        </div>
    );
}

export default Itemlist;

/* let icon = null;
                if (item.starttime) {
                    icon = <img src='to-do-list.png' className='h-10 w-10'/>;
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
                    dueBgColor = '#f70505';
                }
                
                const dueLocal = generateDate(item.due);
                return (
                <div
                    style={{backgroundColor: bgColor}}
                    className="todo-item bg-black-50 br1 ma1 pa1 button w-100"
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
                    {icon}
                    <div className='w-100'>{item.description}</div>
                    <div className='flex'>
                        <div className='w-70' style={{backgroundColor: dueBgColor}}>{dueLocal} </div>
                        <div className='w-30'>{duration(item.hours, item.mins)}</div>
                    </div>
                </div>
                ); */