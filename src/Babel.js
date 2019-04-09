import React from "react";
class ColorShifter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {hsl: 0};
    this.addHsl =this.addHsl.bind(this);
    this.reduceHsl=this.reduceHsl.bind(this);
    this.divStyle = {
      backgroundColor: `hsl(${this.state.hsl}, 100%, 50%)`
      } 
      this.addHsl = this.addHsl.bind(this);
      this.reduceHsl=this.reduceHsl.bind(this);    
  }
  addHsl() {
    this.setState({hsl: (this.state.hsl +15) })
    this.divStyle = {
      backgroundColor: `hsl(${this.state.hsl}, 100%, 50%)`
      } 
  }
 reduceHsl() {
    this.setState({hsl: (this.state.hsl -15) })
    this.divStyle = {
      backgroundColor: `hsl(${this.state.hsl}, 100%, 50%)`
      } 
  }
  render() {
    return (
      <div>
        <button onClick={this.addHsl}>Add HSL</button>        
        <button onClick={this.reduceHsl}>Reduce HSL</button>
        <p>{this.state.hsl}</p>
        <div id="square" style={this.divStyle}></div>
      </div>
    )
  }  
}

