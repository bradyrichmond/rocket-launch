import React from 'react';
import './css/App.css';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import moment from 'moment';
import Cookie from 'universal-cookie';
import Particles from 'react-particles-js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

class App extends React.Component {
  state = {
    loggedIn: false,
    displayTime: '',
    cookies: null,
    launch: {
      company: 'SpaceX',
      streamUrl: 'https://www.youtube.com/embed/y4xBFHjkUvw',
      launchTime: "2020-06-04 02:25",
      booster: 'Falcon 9',
      payload: 'Starlink Satellites',
      crewed: false,
      estimated: false
    }
  }

  responseGoogle = (resp) => {
    axios.post(`http://localhost:5000/logincomplete?code=${resp.code}`)
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
    let display = moment(this.state.launch.launchTime).utc().diff(moment().utc());
    let displayTime;
    if (display < 0) {
      displayTime = "happening now!";
    } else {
      displayTime = this.formatDisplayTime(display);
    }
    this.setState({displayTime});
  }

  formatDisplayTime = (time) => {
    let days = moment(time).format("DD") - 1;
    let hours = moment(time).format("HH");
    let minutes = moment(time).format("mm");
    let seconds = moment(time).format("ss");
    if (days < 1) {
      return `in ${hours}h${minutes}m${seconds}s`
    } else if (days === 1) {
      return `in 1d ${hours}h ${minutes}m ${seconds}s`
    } else if (seconds < 1) {

    } else {
      return `in ${days}d ${hours}h ${minutes}m ${seconds}s`
    }
  }

  componentDidMount() {
    let cookies = new Cookie();
    this.setState({ cookies });
    setInterval(this.setDisplayTime, 1000);
  }

  render() {
    return (
      <div className="App">
        <Particles
          params={{
            "width": '100%',
            "height": '100%',
            "particles": {
                "number": {
                    "value": 100
                },
                "size": {
                    "value": 3
                }
            },
            "interactivity": {
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    }
                }
            }
        }} />
        <Router>
          <Switch>
              <Route exact path="/">
                <div className='launch-date'>Next launch {this.state.displayTime}</div>
                {this.state.launch && this.state.launch.streamUrl &&
                  <div className='stream-link'>
                    <iframe
                      title="launch-stream"
                      width="560"
                      height="315"
                      src={`${this.state.launch.streamUrl}`}
                      frameborder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                      allowfullscreen
                    >
                    </iframe>
                    {/* <a href="https://www.youtube.com/watch?v=Aymrnzianf0" target='_blank' rel='noopener noreferrer'>Click here for stream!</a> */}
                  </div>
              }
              </Route>
              <Route path="/login">
                {!this.state.loggedIn &&
                  <div className="google-login">
                    <GoogleLogin
                      clientId='517580266434-c9en3nf8itaojpvdfs3s7lldpbhoft6c.apps.googleusercontent.com'
                      render={renderProps => (
                        <button onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</button>
                      )}
                      buttonText="Login"
                      onSuccess={this.responseGoogle}
                      onFailure={this.responseGoogle}
                      cookiePolicy={'single_host_origin'}
                      responseType='code'
                    />
                  </div>
                }
              </Route>
              <Route path="/addlaunch">
                {this.state.loggedIn &&
                  <div onClick={this.addLaunch}>
                    LAUNCH!
                  </div>
                }
              </Route>
              <Route path="/launchlist">
                launchlist
              </Route>
            </Switch>
        </Router>
      </div>
    );
  }
}

export default App;