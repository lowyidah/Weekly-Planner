import React, { useEffect } from 'react';

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
        fetch('http://localhost:3000/register', {
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
        <article className="pa4 black-80">
            <div className="measure center">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f4 fw6 ph0 mh0">Register</legend>
                <div className="mt3">
                    <label className="db fw4 lh-copy f6" htmlFor="email-address">Email address</label>
                    <input className="pa2 input-reset ba bg-transparent w-100 measure" onChange={onEmailChange}
                    type="email" name="email-address" id="email-address" onKeyPress={onKeyPress}/>
                </div>
                <div className="mt3">
                    <label className="db fw4 lh-copy f6" htmlFor="username">Username</label>
                    <input className="pa2 input-reset ba bg-transparent" onChange={onUsernameChange}
                    type="text" name="username" id="username" onKeyPress={onKeyPress}/>
                </div>
                <div className="mt3">
                    <label className="db fw4 lh-copy f6" htmlFor="password">Password</label>
                    <input className="b pa2 input-reset ba bg-transparent" onChange={onPasswordChange}
                    type="password" name="password"  id="password" onKeyPress={onKeyPress}/>
                </div>
                </fieldset>
                <div className="mt3">
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6" 
                    onClick={onButtonRegister} type="submit" value="Register"/>
                </div>
                <div className="lh-copy mt3 button">
                    <p onClick={() => changeRoute('/signin')} className="f6 link dim black db">Sign in</p>
                </div>
            </div>
        </article>
    )
}

export default Register;