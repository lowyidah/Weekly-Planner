import React, { useEffect } from 'react';

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

        fetch('http://localhost:3000/signin', {
            method: 'post',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
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
        <main className="pa4 black-80">
            <div className="measure center">
                <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f4 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        type="email" name="email-address"  id="email-address" onChange={onEmailChange}
                        onKeyPress={onKeyPress}/>
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                        type="password" name="password" id="password" onChange={onPasswordChange}
                        onKeyPress={onKeyPress}/>
                    </div>
                </fieldset>
                <div className="">
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                    onClick={onButtonSignin} type="submit" value="Sign in"/>
                </div>
                <div className="lh-copy mt3 button">
                    <span onClick={() => changeRoute('/register')} className="f6 link dim black db">Register</span>
                </div>
            </div> 
        </main>
    );
}

export default Signin;