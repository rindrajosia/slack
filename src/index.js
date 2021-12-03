import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';

const Root = () => (
  <Router>
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route exact path="/login" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
    </Routes>
  </Router>
);

ReactDOM.render(<Root />, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
