import React, {useState, useEffect, useRef, useCallback} from 'react';
import moment from 'moment';
import ReactTooltip from 'react-tooltip';

import star from '../images/star.svg';
import stream from '../images/stream.svg';
import crewed from '../images/crewed.svg';
import droneship from '../images/droneship.svg';
import recovery from '../images/booster_recovery.svg';
import landing from '../images/landing.svg';
import reused from '../images/reused_booster.svg';
import useWindowDimensions from '../utilities/useWindowDimensions';

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
    const [simpleDisplayTime, setSimpleDisplayTime] = useState(false);
  
    const { width } = useWindowDimensions();
    let timeUpdater;
  
    useEffect(() => {
      let { bigStar, littleStar } = generateStars(props.width, props.height);
      setBigStarStyle(bigStar);
      setSmallStarStyle(littleStar);
      runTimeUpdater();
    }, []);
  
    const runTimeUpdater = () => {
      const getDisplayTime = () => {
        let display = moment(props.launch.launchTimeString).utc().diff(moment().utc());
        let displayTime;
        if (display < 0) {
          displayTime = "happening now!";
        } else {
          displayTime = formatSimpleDisplayTime(display);
        }
  
        setSimpleDisplayTime(displayTime);
      };
  
      getDisplayTime();
  
      setInterval(getDisplayTime, 60000);
    }
  
    const formatSimpleDisplayTime = (time) => {
      let days = moment(time).format("DD") - 1;
      let hours = moment(time).format("HH");
      let minutes = moment(time).format("mm");
  
      if (days < 1) {
        return `T-${hours}h ${minutes}m`
      } else if (days === 1) {
        return `T-1d ${hours}h`
      } else {
        return `T-${days}d ${hours}h`
      }
    }
  
    return (
      <div className={`launch-tile${props.main ? ' main' : ''}`} style={{width: `${props.width}${props.main ? '%' : 'rem'}`, height: `${props.height}rem`, right: width < 800 ? `${props.indexCount * 27}rem` : `${props.indexCount * 44}rem`, transition: 'all 1s'}}>
        <div className="launch-tile-data">
          <p className="launch-tile-header">{props.launch.company}</p>
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
          <div style={{display: 'flex', flexDirection: 'row'}}>
            {(props.displayTime && props.main) && <div className="launch-tile-time">
              {props.displayTime}
            </div>}
            {(!props.main && simpleDisplayTime) && <div className={`launch-tile-time${!props.main ? ' small' : ''}`}>
              {simpleDisplayTime}
            </div>}
          </div>
        </div>
        
        {(props.main && width > 800) &&
          <div className='status-container'>
            <div className={`status-item${props.launch.reused ? '' : ' disabled'}`} data-tip data-for='reused_booster'>
              <img src={reused} alt={props.launch.reused ? 'booster has been used before' : 'this is the first launch of this booster'}/>
              <ReactTooltip id='reused_booster' type='light'>
                <span>{props.launch.reused ? 'booster has been used before' : 'this is the first launch of this booster'}</span>
              </ReactTooltip>
            </div>
            <div className={`status-item${props.launch.recovery ? '' : ' disabled'}`} data-tip data-for='booster_recovery'>
              <img src={recovery} alt={props.launch.recovery ? 'booster recovery will be attempted' : 'booster recovery will not be attempted'}/>
              <ReactTooltip id='booster_recovery' type='light'>
                <span>{props.launch.recovery ? 'booster recovery will be attempted' : 'booster recovery will not be attempted'}</span>
              </ReactTooltip>
            </div>
            <div className={`status-item${props.launch.landingOnDrone ? '' : ' disabled'}`} data-tip data-for='drone_landing'>
              <img src={droneship} alt={props.launch.landingOnDrone ? `booster will attempt to land on ${props.launch.droneName}` : 'booster will not attempt a droneship landing'}/>
              <ReactTooltip id='drone_landing' type='light'>
                <span>{props.launch.landingOnDrone ? `booster will attempt to land on ${props.launch.droneName}` : 'booster will not attempt a droneship landing'}</span>
              </ReactTooltip>
            </div>
            <div className={`status-item${props.launch.landingOnLand ? '' : ' disabled'}`} data-tip data-for='land_landing'>
              <img src={landing} alt={props.launch.landingOnLand ? 'booster will attempt to land on land' : 'booster will not attempt to land on land'}/>
              <ReactTooltip id='land_landing' type='light'>
                <span>{props.launch.landingOnLand ? 'booster will attempt to land on land' : 'booster will not attempt to land on land'}</span>
              </ReactTooltip>
            </div>
            <div className={`status-item${props.launch.crewed ? '' : ' disabled'}`} data-tip data-for='crewed'>
              <img src={crewed} alt={props.launch.crewed ? 'this launch is crewed' : 'this launch is not crewed'}/>
              <ReactTooltip id='crewed' type='light'>
                <span>{props.launch.crewed ? 'this launch is crewed' : 'this launch is not crewed'}</span>
              </ReactTooltip>
            </div>
            <div className={`status-item${props.launch.streamLink ||  props.launch.streamUrl ? '' : ' disabled'}`} data-tip data-for='stream'>
              <img src={stream} alt={props.launch.streamLink || props.launch.streamUrl ? 'launch will be live streamed' : 'there is no launch stream yet'}/>
              <ReactTooltip id='stream' type='light'>
                <span>{props.launch.streamLink || props.launch.streamUrl ? 'launch will be live streamed' : 'there is no launch stream yet'}</span>
              </ReactTooltip>
            </div>
          </div>
        }
        <div style={bigStarStyle} />
        <div style={smallStarStyle} />
      </div>
    )
  }

  export default LaunchTile;