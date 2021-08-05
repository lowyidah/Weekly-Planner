import './Footer.css'
import React from 'react'; 

const Footer = () => {
    
    return (
        <div className=' footerWrapper pa3 f7 white-60'>
            <div className='footer'>
                <div className='mr4'>
                    Icons made by <a className='white-60' href="https://www.flaticon.com/authors/monkik" title="monkik">monkik</a> 
                    {" from"} <a className='white-60' href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
                </div>
                <div>
                    Website made by Low Yi Dah
                </div>
            </div>
        </div>
    );
}

export default Footer;

