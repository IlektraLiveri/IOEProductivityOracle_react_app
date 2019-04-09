import React, { Component } from 'react';
import PubNubReact from 'pubnub-react';

  class Default extends Component {
  constructor(props) {
    super(props);
    this.pubnub = new PubNubReact({ publishKey: 'pub-c-7c0e82a5-cb64-40d5-b0b2-48b8ed7be389', subscribeKey: 'sub-c-6eeb1f86-ed7d-11e8-b4b3-36001c7c3431' });
    this.pubnub.init(this);
  }
  
  componentWillMount() {
    this.pubnub.subscribe({ channels: ['IOT'], withPresence: true });
    
    this.pubnub.getMessage('IOT', (msg) => {
      console.log(msg);
    });
    
    this.pubnub.getStatus((st) => {
      console.log(st);
      this.pubnub.publish({ message: 'hello world from react', channel: 'IOT' });
    });
  }
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({ channels: ['IOT'] });
  }
  
  render() {
    const messages = this.pubnub.getMessage('IOT');
  return (
    <div>
     pub
    </div>
    );
  }
}
export default Default;