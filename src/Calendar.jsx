import React from "react";
import dateFns from "date-fns";
import PubNubReact from 'pubnub-react';
import Button from 'react-bootstrap/Button'

//MATERIAL UI
//import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

class Calendar extends React.Component { // Our callendar class which call the calendar component
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    open: false,
    colour: ''
  };
  constructor(props) { 
    super(props);// Connects our react app to our pubnub channel.
    this.pubnub = new PubNubReact({ publishKey: 'pub-c-7c0e82a5-cb64-40d5-b0b2-48b8ed7be389', 
    subscribeKey: 'sub-c-6eeb1f86-ed7d-11e8-b4b3-36001c7c3431' });
    this.pubnub.init(this);// Allows for our pubnub history to be avaulable for viewing.
      this.pubnub.history(
         {
        channel : 'IOT',
        count : 100 // Send the last 100 messages to history.
        },
        function(status, response){ //Callback function
         }
        );
    this.handleChange = this.handleChange.bind(this);// Calls the handleChange and sendMessage functions into the constructor.
      this.sendMessage = this.sendMessage.bind(this);
     };
   componentWillMount() {
    this.pubnub.subscribe({ channels: ['IOT'], withPresence: true });
    
    this.pubnub.getMessage('IOT', (msg) => { // Appends getMessage function, which contains the message that is to be sent to pubnub
      console.log(msg);
    });
    
    this.pubnub.getStatus((st) => {
      console.log(st);

    });


  }
  

  componentWillUnmount() {
    this.pubnub.unsubscribe({ channels: ['IOT'] });
  }


  renderHeader() {
    const dateFormat = "MMMM YYYY";

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={this.prevMonth}>  {/* This appends the prevMonth function onto the event handler. 
          														The previous month will show when the left icon is clicked  */}
            chevron_left
          </div>
        </div>
        <div className="col col-center">
          <span>{dateFns.format(this.state.currentMonth, dateFormat)}</span>
        </div>
        <div className="col col-end" onClick={this.nextMonth}> {/* Appends nextMonth function onto the event handler.
        															 Shows next month when the next icon is clicked */}
          <div className="icon">chevron_right</div>
        </div>
      </div>
    );
  }

  renderDays() {
    const dateFormat = "dddd";
    const days = [];
 
    let startDate = dateFns.startOfWeek(this.state.currentMonth);
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center" key={i}>
          {dateFns.format(dateFns.addDays(startDate, i), dateFormat)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  }

  renderCells() {
  /*Formats for the start and end of weeks and months.*/
    const { currentMonth, selectedDate } = this.state;// Formats for the start and end of weeks and months.
    const monthStart = dateFns.startOfMonth(currentMonth);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const startDate = dateFns.startOfWeek(monthStart);
    const endDate = dateFns.endOfWeek(monthEnd);

    const dateFormat = "D";
    const rows = [];

    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = dateFns.format(day, dateFormat);
        const cloneDay = day;
        days.push(
          <div
            className={`col cell ${
              !dateFns.isSameMonth(day, monthStart)
                ? "disabled"
                : dateFns.isSameDay(day, selectedDate) ? "selected" : ""
            }`}
            key={day}
            onClick={() => this.onDateClick(dateFns.parse(cloneDay))}
          >
            <span className="number">{formattedDate}</span>
            <span className="bg">{formattedDate}</span>
          </div>
        );
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  }

  onDateClick = day => {
    const formattedDay = (day.toString()).substr(8, 2);// toString substracts only specific elements within a string. This allows for only the date to come through to pubnub, without a month, year or time stamp.
    this.setState({
      selectedDate: formattedDay,
      open: true,
    });
  };
  handleChange(event) {
    this.setState({
      colour: event.target.value
    });
  }
  sendMessage() {
  	/*
  	The below commented out code was the original message which was being sent through to PubNub. Originally, our LED matrix would have been able to
  	show a number which was assigned a colour by the user. The below line of code would sent through a number, as well as the rgb value that the user
  	had decided to assign to that specific date. As we were not able to enable our AdaFruit Matrix to communicate with PubNub, we had to change the message being sent
  	through to just a number, and use a 8x8 matrix which only displays numbers instead.
  	this.pubnub.publish({ message: {colour: this.state.colour, date: this.state.selectedDate},  channel: 'IOT' }, this.handleClose);
  	*/
    var date = this.state.selectedDate;
    this.pubnub.publish({ message: this.state.selectedDate,  channel: 'IOT' }, this.handleClose);// Sends the selected date message to PubNub.
    console.log(date);
  }
  handleClose = () => {
    this.setState({ open: false});
  };
  nextMonth = () => {
    this.setState({
      currentMonth: dateFns.addMonths(this.state.currentMonth, 1) 
    });
  };
  prevMonth = () => {
    this.setState({
      currentMonth: dateFns.subMonths(this.state.currentMonth, 1)
    });
  };

  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
    
		{/* Opens a dialogue when the user clicks on a date they would like to assign an event onto. */}
        <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Would you like to add an event on this day?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please assign a colour to your event.
            </DialogContentText>
            <form>
              <FormControl>
                <Select
                    onChange={this.handleChange}
                    value={this.state.colour}
                    inputProps={{
                      name: 'colour',
                      id: 'colour-rgb',
                    }}
                >
            {/* Dialogue menu items and the rgb values which would be sent to pubnub if we were using our AdaFruit LED Matrix. */}
                  <MenuItem value={"255,140,0"}>Orange</MenuItem>
                  <MenuItem value={"148,0,211"}>Purple</MenuItem>
                  <MenuItem value={"255,0,0"}>Red</MenuItem>
                  <MenuItem value={"0,191,255"}>Blue</MenuItem>
                  <MenuItem value={"255,255,0"}>Yellow</MenuItem>
                  <MenuItem value={"173,255,47"}>Green</MenuItem>
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.sendMessage} color="primary"> {/*The message will be sent to PubNub after the user has submitted their choices. */}
				Submit
            </Button>
          </DialogActions>
        </Dialog>


      </div>
    );
  }
}

export default Calendar;