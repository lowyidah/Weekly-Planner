import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";

let backendUrl;
if (process.env.NODE_ENV === 'production') {
  backendUrl = 'https://planner-server-1515.herokuapp.com';
}
else {
  backendUrl = 'http://localhost:3000';
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App backendUrl={backendUrl}/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
