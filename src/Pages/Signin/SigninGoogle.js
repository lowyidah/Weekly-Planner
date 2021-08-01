import React from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';

const SigninGoogle = () => {
    const responseGoogle = (response) => {
        console.log(response);
    }

    const logoutSuccess = () => {
        console.log("Logout successful")
    }

    return (
        <div>
            <GoogleLogin
            clientId="930258761655-qk0m5auba2o98csltai14rjoh24r38j1.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
            isSignedIn={true}
            />
            <GoogleLogout
            clientId="930258761655-qk0m5auba2o98csltai14rjoh24r38j1.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={logoutSuccess}
            />
        </div>

    );
}

export default SigninGoogle;