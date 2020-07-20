import React, {useState, useEffect, useRef, useCallback} from 'react';
import './css/App.css';
import axios from 'axios';
import moment from 'moment';
import Cookie from 'universal-cookie';

import FutureLaunches from './components/FutureLaunchesCarousel';
import LaunchTile from './components/LaunchTile';
import Reminder from './components/Reminder';
import astronaut from './images/astronaut_bg.svg';
import rocket from './images/rocket.png';
import heart from './images/heart.svg';


let NRL_API_URL = process.env.REACT_APP_NRL_API_URL;
class App extends React.Component {
  state = {
    loggedIn: false,
    displayTime: '',
    cookies: null,
    launch: false,
    launchInProgress: false
  }

  responseGoogle = (resp) => {
    axios.post(`${NRL_API_URL}/logincomplete?code=${resp.code}`)
    .then((response) => {
      let d = new Date();
      d.setTime(response.data.expiry_date);
      let options = { expires: d , sameSite: 'none' }
      this.state.cookies.set('access_token', response.data.access_token, options);
      this.state.cookies.set('id_token', response.data.id_token, options);
      this.setState({ loggedIn: true })  
    })
    .catch((error) => {
      alert(`Error: ${JSON.stringify(error)}`);
    })
  }

  setDisplayTime = () => {
    let momentTime = moment(this.state.launch.launchTimeString).utc();
    let display = momentTime.diff(moment().utc());
    let displayTime;
    
    if (momentTime.valueOf() - moment().utc().valueOf() < 0) {
      this.setState({
        launchInProgress: true
      });
      displayTime = "happening now!";
    } else {
      displayTime = this.formatDisplayTime(display);
    }

    this.setState({displayTime});
  }

  formatDisplayTime = (time) => {
    let days = moment(time).format("DD") - 1;
    let hours = moment(time).add(1, 'hours').format("HH");
    let minutes = moment(time).format("mm");
    let seconds = moment(time).format("ss");

    if (this.state.launch.scrubbed) {
      return "is scrubbed";
    }

    if (days < 1) {
      return `T-${hours}h ${minutes}m ${seconds}s`
    } else if (days === 1) {
      return `T-1d ${hours}h ${minutes}m ${seconds}s`
    } else {
      return `T-${days}d ${hours}h ${minutes}m ${seconds}s`
    }
  }

  getNextLaunch = () => {
    axios.get(`${NRL_API_URL}/launches/next`)
    .then((response) => {
      let launch = response.data;
      this.setState({launch});
      setInterval(this.setDisplayTime, 1000);
    })
    .catch(() => {
      console.error('error fetching launch')
    })
  }

  componentDidMount() {
    let cookies = new Cookie();
    this.setState({ cookies });
    this.getNextLaunch();
  }

  render() {
    return (
      <div className="App">
        <div className="main-launch-grid">
          <div className="main-launch-grid-col1">
            <p className="nrl-header">Next Rocket Launch</p>
            {this.state.launch && <LaunchTile main={true} launch={this.state.launch} displayTime={this.state.displayTime}/>}
            {!this.state.launch && <p className="nrl-header">Error fetching launches</p>}
          </div>
          <div className="main-launch-grid-col2">
            <div style={{background: `url(${astronaut})`, backgroundSize: 'cover', width: '45rem', height: '45rem'}} />
          </div>
        </div>
        <div className="future-launch-container">
          <FutureLaunches />
        </div>
        <div className='footer-container'>
          <div className='rocket-container' style={{background: `url(${rocket})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom left'}} />
          {/* <Reminder /> */}
          <div className='signature' style={{position: 'fixed', bottom: '1rem', right: '1rem'}}>Created with <img src={heart} alt='love' style={{height: '1rem', width: '1rem'}}/> by Brady</div>
        </div>
      </div>
    );
  }
}





export default App;