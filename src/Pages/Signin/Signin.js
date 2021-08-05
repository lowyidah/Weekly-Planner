import React, { useEffect } from 'react';
import Footer from '../../Components/Footer/Footer.js';
import './Signin.css';


const Signin = ({ changeRoute, setUser, reloadUser, replaceRoute }) => {
    useEffect(() => {
        reloadUser();
    }, [reloadUser]);

    let inputEmail = '';
    let inputPassword = '';

    const onEmailChange = (event) => {
        inputEmail = event.target.value;
    }

    const onPasswordChange = (event) => {
        inputPassword = event.target.value;
    }

    const onButtonSignin = () => {

        fetch('https://planner-server-1515.herokuapp.com/signin', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: inputEmail,
                password: inputPassword
            })
        })
        .then(response => response.json())
        .then(userInfo => {
            if (userInfo.id) {
                setUser(userInfo);
                replaceRoute('/summary');
            }
            else {
                window.alert(userInfo);
            }
        })
        .catch(() => {
            console.log("Unable to sign in");
        });
    }

    const onKeyPress = (event) => {
        if (event.charCode === 13) {
            onButtonSignin();
        }
    }

    return (
        <div className='signinPage'>
            <div className='signinTitle'>
                <img src='to-do-list.png' alt='' className='logo mr2'/>
                <span className='f2 fw5'>{' Weekly Plannerrr'}</span>
            </div>
            
            <div className="br3 ba b--black-10 pa4 shadow-3 center signinBox">
                <legend className="f3 fw6 ph0 mh0 center">Sign In</legend>

                <div className="mt4">
                    <label className="db fw6 f6 pb2" htmlFor="email-address">Email</label>
                    <input className="pa2 input-reset ba b--mid-gray bg-transparent hover-bg-black-70 hover-white w-100 signinInputField" 
                    type="email" name="email-address"  id="email-address" onChange={onEmailChange}
                    onKeyPress={onKeyPress}/>
                </div>
                <div className="mt3 mb4">
                    <label className="db fw6 f6 pb2" htmlFor="password">Password</label>
                    <input className="b pa2 input-reset ba b--mid-gray bg-transparent hover-bg-black-70 hover-white w-100 signinInputField" 
                    type="password" name="password" id="password" onChange={onPasswordChange}
                    onKeyPress={onKeyPress}/>
                </div>

                <div className='center'> 
                    <div className="b ph3 pv2 ba b--black bg-transparent button f6 hover-bg-black-20" 
                    onClick={onButtonSignin} type="submit">Sign In</div>
                </div>
                <div className='center'>
                    <div className="mt2 button f6 black underline" onClick={() => changeRoute('/register')}>Register</div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Signin;