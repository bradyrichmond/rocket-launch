import React, { Component } from 'react';
import axios from 'axios';

import spacex from '../images/spacex.jpeg';
import rocketlab from '../images/rocket-lab.png';
import falcon9 from '../images/falcon-9.png';
import falconHeavy from '../images/falcon-heavy.jpg';
import electron from '../images/electron.png';

class Launches extends Component {
    state = {
        launches: []
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_NRL_API_URL}/launches`)
        .then((response) => {
            let launches = response.data;
            this.setState({launches});
        })
        .catch(() => {

        })
    }

    render() {
        return (
            <div className='outer-launch-container'>
                {this.state.launches &&
                    <div className='inner-launch-container'>
                        {this.state.launches.map((launch) => {
                            return (
                                <LaunchCard launch={launch} key={launch._id}/>
                            )
                        })}
                    </div>}
            </div>
        )
    }
}

// { _id: 5ee2717008d540469cd42c5b,
//     company: 'RocketLab',
//     streamUrl: false,
//     streamLink: false,
//     launchTimeString: '2020-06-13 04:43',
//     launchTimeUnix: 1592023380000,
//     booster: 'Electron',
//     payload: 'satellites',
//     crewed: false,
//     estimated: false,
//     landing: false,
//     landingOnDrone: false,
//     droneName: 'Of Course I Still Love You',
//     landingOnLand: false,
//     landingPadName: '39A',
//     scrubbed: false }

class LaunchCard extends Component {
    getBoosterImage = () => {
        let booster = this.props.launch.booster;
        if (booster === "Falcon 9") {
            return falcon9;
        } else if (booster === "Falcon Heavy") {
            return falconHeavy;
        } else if (booster === "Electron") {
            return electron;
        } else {
            return false;
        }
    }

    render() {
        let boosterImage = this.getBoosterImage();
        return (
            <div className='launch-card'>
                <p className='launch-card-company'>{this.props.launch.company}</p>
                <div className='launch-card-image-container' style={{background: `url(${boosterImage})`, backgroundSize: 'cover'}}/>
                <div className='launch-card-data'>
                    {this.props.launch.booster && <p>Booster: {this.props.launch.booster}</p>}
                    {this.props.launch.payload && <p>Payload: {this.props.launch.payload}</p>}
                    {this.props.launch.launchTimeString && <p>Launch Time: {this.props.launch.launchTimeString} UTC</p>}
                </div>
                <div className='launch-card-button'>Show Countdown</div>
            </div>
        )
    }
}

export default Launches;