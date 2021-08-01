import React from 'react';
import './ListInput.css';

const ListInput = ({ onInputChange, onButtonAdd }) => {
    const onKeyPress = (event) => {
        if (event.charCode === 13) {
            onButtonAdd('items');
        }
    }
    return (
        <div className="bg-black-50 pv3 br3  listInput">
                <input onChange={ (event) => {onInputChange('description', event)} } onKeyPress={onKeyPress}
                className="pa1 inputField br2 ba bw1 b--black-70" type="tex" placeholder="Description (req)"/>
                <input onChange={ (event) => onInputChange('hours', event) } onKeyPress={onKeyPress}
                className="pa1 inputField br2 ba bw1 b--black-70" type="number" placeholder="Hrs (opt)"/>
                <input onChange={ (event) => onInputChange('mins', event) } onKeyPress={onKeyPress}
                className="pa1 inputField br2 ba bw1 b--black-70" type="number" placeholder="Mins (opt)"/> 
                <div>
                    <span className="f6 grow br3 pa2 no-underline dib white bg-black button"
                    onClick={() => onButtonAdd('items')}>Add [ To Do ] </span>
                </div>

                <textarea onChange={ (event) => onInputChange('details', event) } placeholder="Details (opt)"
                className="inputField pa1 br2 ba bw1 b--black-70"></textarea>
                <div className='dateTimeWrapper'>
                    <input onChange={ (event) => onInputChange('datetime', event) } type='datetime-local' onKeyPress={onKeyPress}
                    className='inputField dateTime pa1 br2 ba bw1 b--black-70'/>
                </div>
                <div>
                    <span className="f6 grow br3 pa2 dib white bg-black button"
                    onClick={() => onButtonAdd('doingitems')}>Add [ Doing ] </span>
                </div>
        </div>

    );
}

export default ListInput;