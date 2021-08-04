import React, { useEffect } from 'react';
import Footer from '../../Components/Footer/Footer.js';
import './Register.css'

const Register = ({ changeRoute, setUser, reloadUser }) => {

    useEffect(() => {
        reloadUser();
    }, [reloadUser]); 
    
    let inputEmail = '';
    let inputPassword = '';
    let inputUsername = '';

    const onEmailChange = (event) => {
        inputEmail = event.target.value;
    }

    const onPasswordChange = (event) => {
        inputPassword = event.target.value;
    }

    const onUsernameChange = (event) => {
        inputUsername = event.target.value;
    }

    const onButtonRegister = () => {
        fetch(process.env.SERVER_URL + 'register', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                email: inputEmail,
                username: inputUsername,
                password: inputPassword
            })
        })
        .then(response => response.json())
        .then(userInfo => {
            if(userInfo.id) {
                setUser(userInfo);
                changeRoute('/howtouse');
            }
            else {
                window.alert(userInfo);
            }
        })
        .catch(err => console.log(err));
    }

    const onKeyPress = (event) => {
        if (event.charCode === 13) {
            onButtonRegister();
        }
    }

    return(
        <div className='registerPage'>
            <div className="br3 ba b--black-10 pa4 shadow-3 center registerBox">   
                <legend className="f3 fw6 ph0 mh0 center">Register</legend>

                <div className="mt4">
                    <label className="db fw6 f6 pb2" htmlFor="email-address">Email address</label>
                    <input className="pa2 input-reset ba b--mid-gray bg-transparent hover-bg-black-70 hover-white w-100 registerInputField" onChange={onEmailChange}
                    type="email" name="email-address" id="email-address" onKeyPress={onKeyPress}/>
                </div>
                <div className="mt3">
                    <label className="db fw6 f6 pb2" htmlFor="username">Username</label>
                    <input className="pa2 input-reset ba b--mid-gray bg-transparent hover-bg-black-70 hover-white w-100 registerInputField" onChange={onUsernameChange}
                    type="text" name="username" id="username" onKeyPress={onKeyPress}/>
                </div>
                <div className="mt3 mb4">
                    <label className="db fw6 f6 pb2" htmlFor="password">Password</label>
                    <input className="pa2 input-reset ba b--mid-gray bg-transparent hover-bg-black-70 hover-white w-100 registerInputField" onChange={onPasswordChange}
                    type="password" name="password"  id="password" onKeyPress={onKeyPress}/>
                </div>       
                
                <div className="center">
                    <div className="b ph3 pv2 ba b--black bg-transparent button f6 hover-bg-black-20" 
                    onClick={onButtonRegister} type="submit">Register</div>
                </div>
                <div className="center">
                    <div onClick={() => changeRoute('/signin')} className="mt2 button f6 black underline">Sign in</div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default Register;