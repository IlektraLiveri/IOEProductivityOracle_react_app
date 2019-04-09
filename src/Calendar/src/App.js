import React from "react";

import Calendar from "./Calender";

import "./App.css";

import ColorShifter from "./Babel"
class App extends React.Component {
  render() {

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
        <main>
          <Calendar />
        </main>
      </div>
    );

  
  
};
}

export default App;