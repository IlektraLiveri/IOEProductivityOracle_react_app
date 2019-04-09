import React from 'react';
import './App.css';
import Calendar from './Calendar';
const App = () => {
  return (
    <div className="App">
    <header>
          <div id="logo">
            <span className="icon">date_range</span>
            <span>
              Productivity<b>Oracle</b>
            </span>
          </div>
        </header>
    <Calendar/>
    </div>
    );
};
export default App;
