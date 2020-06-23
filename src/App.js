import React, {useState, useEffect, useRef, useCallback} from 'react';
import './css/App.css';
import axios from 'axios';
import moment from 'moment';
import Cookie from 'universal-cookie';
import astronaut from './images/astronaut_bg.svg';
import star from './images/star.svg';
import rocket from './images/rocket.svg';
import circle from './images/circle.svg';
import left from './images/left.svg';
import right from './images/right.svg';

// {
//   company: 'Default Data',
//   streamUrl: false,
//   streamLink: false,
//   launchTimeString: "2020-06-13 04:43",
//   launchTimeUnix: 1592023380000,
//   booster: 'Electron',
//   payload: 'satellites',
//   crewed: false,
//   estimated: false,
//   landing: false,
//   landingOnDrone: false,
//   droneName: 'Of Course I Still Love You',
//   landingOnLand: false,
//   landingPadName: '39A',
//   scrubbed: false
// }

let NRL_API_URL = process.env.REACT_APP_NRL_API_URL;
class App extends React.Component {
  state = {
    loggedIn: false,
    displayTime: '',
    cookies: null,
    launch: {},
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
    let display = moment(this.state.launch.launchTimeString).utc().diff(moment().utc());
    let displayTime;
    if (display < 0) {
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
    let hours = moment(time).format("HH");
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
    })
    .catch(() => {
      console.error('error fetching launch')
    })
  }

  componentDidMount() {
    let cookies = new Cookie();
    this.setState({ cookies });
    this.getNextLaunch();
    setInterval(this.setDisplayTime, 1000);
  }

  render() {
    return (
      <div className="App">
        <div className="main-launch-grid">
          <div style={{gridColumnStart: 1, gridColumnEnd: 1, gridRow: 1}}>
            <p className="nrl-header">Next Rocket Launch</p>
            <LaunchTile main={true} launch={this.state.launch} height={25} displayTime={this.state.displayTime}/>
          </div>
          <div style={{display: 'grid', gridRow: 1, position: 'absolute', right: 0, gridColumnStart: 3}}>
            <div style={{background: `url(${astronaut})`, backgroundSize: 'cover', width: '45rem', height: '45rem'}} />
          </div>
        </div>
        <div className="future-launch-container">
          <FutureLaunches />
        </div>
      </div>
    );
  }
}

const generateSidePosition = (sideCount, offset, width, height, filter) => {
  let sides = [ 'top', 'bottom', 'left', 'right'];
  const sideindex = Math.round(Math.random() * (sideCount - 1));
  if (filter) {
    sides = sides.filter((side) => side !== filter);
  }

  let sideStyle = {};
  let horizontalPosition;
  let verticalPosition;

  switch (sides[sideindex]) {
    case 'top':
      horizontalPosition = generatePosition(width);
      sideStyle = {style: {top: offset, left: `${horizontalPosition}rem`}, side: sides[sideindex]};
      break;
    case 'bottom':
      horizontalPosition = generatePosition(width);
      sideStyle = {style: {bottom: offset, left: `${horizontalPosition}rem`}, side: sides[sideindex]};
      break;
    case 'left':
      verticalPosition = generatePosition(height);
      sideStyle = {style: {left: offset, top: `${verticalPosition}rem`}, side: sides[sideindex]};
      break;
    case 'right':
      verticalPosition = generatePosition(height);
      sideStyle = {style: {right: offset, top: `${verticalPosition}rem`}, side: sides[sideindex]};
      break;
    default:
      break;
  }

  return sideStyle;
}

const generatePosition = (base) => {
  return Math.round(Math.random() * base);
}

const generateStars = (width, height) => {
  let bigStarPosition = generateSidePosition(4, '-2rem', width, height)
  let littleStarPosition = generateSidePosition(3, '-1.3rem', width, height, bigStarPosition.side);
  
  return {
    bigStar: Object.assign({}, {
      background: `url(${star})`,
      backgroundSize: 'cover',
      height: '4rem',
      width: '4rem',
      position: 'absolute'
    }, bigStarPosition.style),
    littleStar: Object.assign({},{
      background: `url(${star})`,
      backgroundSize: 'cover',
      height: '2.6rem',
      width: '2.6rem',
      position: 'absolute'
    }, littleStarPosition.style)
  }
}

const LaunchTile = (props) => {
  const [bigStarStyle, setBigStarStyle] = useState({});
  const [smallStarStyle, setSmallStarStyle] = useState({});

  useEffect(() => {
    let { bigStar, littleStar } = generateStars(props.width, props.height);
    setBigStarStyle(bigStar);
    setSmallStarStyle(littleStar);
  }, []);

  return (
    <div className={`launch-tile${props.main ? ' main' : ''}`} style={{width: `${props.width}${props.main ? '%' : 'rem'}`, height: `${props.height}rem`, right: `${props.indexCount * 40}rem`, transition: 'all 1s'}}>
      <p className="launch-tile-header">{props.launch.company}</p>
      <div className="launch-tile-data">
        <div className="launch-tile-data-item">
          <p>Booster:</p>
          <p>{props.launch.booster}</p>
        </div>
        <div className="launch-tile-data-item">
          <p>Payload:</p>
          <p>{props.launch.payload}</p>
        </div>
        <div className="launch-tile-data-item">
          <p>Launch Date:</p>
          <p>{props.launch.launchTimeString} UTC</p>
        </div>
      </div>
      <div className="launch-tile-time">
        {props.displayTime}
      </div>
      <div style={bigStarStyle} />
      <div style={smallStarStyle} />
    </div>
  )
}

const getFutureLaunches = async () => {
  return axios.get(`${process.env.REACT_APP_NRL_API_URL}/launches`)
    .then((response) => {
        return response.data;  
    })
    .catch(() => {
      console.error('error fetching launches');
    })
}

const FutureLaunches = () => {
  const [launches, setLaunches] = useState([]);
  const [launchIndex, setLaunchIndex] = useState(0);
  const [showLeftControl, setShowLeftControl] = useState(true);
  const [showRightControl, setShowRightControl] = useState(true);
  const launchContainer = useRef(null)

  const shouldShowControls = () => {
    let containerWidth = launchContainer.current.getBoundingClientRect().width;
    let fullVisibiliityCount = Math.floor(containerWidth / 400);

    if (launches.length > fullVisibiliityCount) {
      setShowLeftControl(true);
      setShowRightControl(true);
    } else if (launches.length <= fullVisibiliityCount) {
      setShowLeftControl(false);
      setShowRightControl(false);
    }
  }

  const shouldShowControlsCallback = useCallback(shouldShowControls, []);

  useEffect(() => {
    const futureLaunches = async () => {
      let launchList = await getFutureLaunches();
      setLaunches(launchList);
    }
    futureLaunches();
  }, []);

  const moveLaunches = (left) => {
    let newLaunchIndex;
    if (left && showLeftControl && launchIndex < launches.length - 1) {
      newLaunchIndex = launchIndex + 1;
    } else if (!left && showRightControl && launchIndex > 0) {
      newLaunchIndex = launchIndex - 1;
    }

    if ((newLaunchIndex || newLaunchIndex === 0) && newLaunchIndex !== launchIndex) {
      setLaunchIndex(newLaunchIndex);
    }
  }

  return (
    <div className={`future-launches-outer-container`} ref={launchContainer}>
      <div style={{background: `url(${rocket})`, backgroundSize: 'cover', width: '35rem', height: '35rem', position: 'fixed', bottom: '0', left: '0', transform: 'scaleX(-1)', gridColumn: 1, gridRow: 1}} />
      <div style={{gridColumn: 2, gridRow: 1, display: 'grid', gridTemplateColumns: '7rem auto 7rem', overflowX: 'hidden'}}>
        <div style={{gridColumn: 1, height: '100%', background: !showLeftControl ? 'linear-gradient(90deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)' : `url(${left}), url(${circle}), linear-gradient(90deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)`, backgroundSize: '4rem', backgroundRepeat: 'no-repeat', backgroundPosition: 'left', zIndex: 1000}} onClick={() => { moveLaunches(true) }}/>
        <div className='future-launches-inner-container'>
            {launches && launches.map((launch) => {
              return (<LaunchTile launch={launch} height={20} width={30} indexCount={launchIndex}/>)
            })}
        </div>
        <div style={{gridColumn: 3, height: '100%', background: !showRightControl ? 'linear-gradient(270deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)' : `url(${right}), url(${circle}), linear-gradient(270deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)`, backgroundSize: '4rem', backgroundRepeat: 'no-repeat', backgroundPosition: 'right', zIndex: 1000}} onClick={() => { moveLaunches(false) }}/>
      </div>
    </div>
  )
}

export default App;