import React from 'react';
import './ItemEditor.css';

const ItemEditor = ({ item, position, type, onInputChange, onButtonSaveChange, 
    onButtonCancelChange, insulateClick, finishedBatchItem, todoItem, deleteItem}) => {

    const { description, hours, mins, details, due } = item;
    
    let dueLocal;
    if (due) {
        const timezoneOffsetMills = (new Date()).getTimezoneOffset() * 60000;
        dueLocal = new Date((new Date(due)) - timezoneOffsetMills).toISOString().split('.')[0];
    }

    let toggleButtons = null;
    if (todoItem && finishedBatchItem) {
        toggleButtons = 
        <div className='toggleButtons pr2'>
            <div></div>
            <div>
                <span className="f6 grow br3 pa2 dib white button IEDeleteButton mt3" 
                onClick={() => {deleteItem(item.id); onButtonCancelChange()}}>Delete Task</span>
            </div>
            <div>
                <span className="f6 grow br3 pa2 dib white button IETodoButton mt3" 
                onClick={() => {todoItem(item.id); onButtonCancelChange()}}>Revert - To Do</span>
            </div>
            <div>
                <span className="f6 grow br3 pa2 dib white button IECompleteButton mt3" 
                onClick={() => {finishedBatchItem(item.id)}}>Completed Task</span>
            </div>
        </div>
    }

    return (
        <div className='itemEditorBody'>
            <div className='ItemEditorWrapper' onClick={onButtonCancelChange}>
                <div className="ItemEditorWindow bg-black-80 br3" onClick={insulateClick}>
                    <input onChange={ (event) => onInputChange('description', event) } value={description}
                    className="pa2 inputField br2 ba bw1 b--black-70 description" type="tex" placeholder="Description"/>
                    <div className='time'>   
                        <input onChange={ (event) => onInputChange('hours', event) } value={hours}
                        className="pa1 inputField br2 ba bw1 b--black-70 time" type="number" placeholder=""/> 
                        <span className='white timeLabel f5 ma1 fw4'>Hours</span>
                    </div>
                    <div className='time'>
                        <input onChange={ (event) => onInputChange('mins', event) } value={mins}
                        className="pa1 inputField br2 ba bw1 b--black-70 time" type="number" placeholder=""/>
                        <span className='white timeLabel f5 ma1 fw4'>Mins</span>
                    </div>
                    <div className="dateTimeEditorWrapper">
                        <input onChange={ (event) => onInputChange('datetime', event) } type='datetime-local'
                        className='pa1 inputField br2 ba bw1 b--black-70 dateTimeEditor' value={dueLocal}/> 
                    </div>

                    <label htmlFor="comment" className="f5 fw5 db mb2 white detailsLabel">Details</label>
                    <textarea onChange={ (event) => onInputChange('details', event) } value={details}
                    className="pa1 inputField br2 ba bw1 b--black-70 w-100 h-100 details"></textarea>
                    {toggleButtons}
                    <div className='cancelChange'>
                            <span className="f6 grow br3 pa2 dib white underline button mt3" 
                            onClick={onButtonCancelChange}>Cancel Changes</span>
                    </div>
                    <div className='saveChange'>
                            <span className="f6 grow br3 pa2 dib white underline button mt3" 
                            onClick={() => onButtonSaveChange(type, position)}>Save Changes</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemEditor;