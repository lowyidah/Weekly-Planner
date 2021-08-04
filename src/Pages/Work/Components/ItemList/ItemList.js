import React from 'react';
import Item from '../Item/Item.js';
import './ItemList.css';


const ItemList = ({ listType, onButtonOpenPopup, onButtonReorder, onButtonTransfer, onButtonDelete, items }) => {

    let listName;
    if(listType === 'todo') {
        listName = 'To Do';
    }
    else if (listType === 'doing') {
        listName = 'Doing';
    }
    else if (listType === 'done') {
        listName = 'Done';
    }
    return(
        <div className='br3 pv3 bg-black-50 itemList'>
            <div className='pv3 fw5 listName'>{listName}</div>  
            {
                items.map((item) => {
                return <Item itemType={listType} onButtonOpenPopup={onButtonOpenPopup}
                onButtonReorder={onButtonReorder} onButtonTransfer={onButtonTransfer} onButtonDelete={onButtonDelete} 
                id={item.id} key={item.id} description={item.description} hours={item.hours} mins={item.mins}
                due={item.due} category={item.category}
                />
                })
            }
        </div>
    );
    
}



export default ItemList;