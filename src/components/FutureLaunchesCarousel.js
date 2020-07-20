import React, {useState, useEffect, useRef, useCallback} from 'react';
import useWindowDimensions from '../utilities/useWindowDimensions';
import axios from 'axios';

import LaunchTile from './LaunchTile';
import circle from '../images/circle.svg';
import left from '../images/left.svg';
import right from '../images/right.svg';

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
  
    const { width } = useWindowDimensions();
  
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
      <React.Fragment>
        <p className='upcoming-launch-header'>Upcoming Launches</p>
        {launches && <div className={`future-launches-outer-container`} ref={launchContainer}>
          <div className='future-launches-grid'>
            <div style={{gridColumn: 1, height: '100%', background: !showLeftControl ? 'linear-gradient(90deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)' : width > 800 ? `url(${left}), url(${circle}), linear-gradient(90deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)` : `url(${left}), url(${circle})`, backgroundSize: '4rem', backgroundRepeat: 'no-repeat', backgroundPosition: 'left', zIndex: 1000}} onClick={() => { moveLaunches(false) }}/>
            <div className='future-launches-inner-container'>
                {launches && launches.map((launch) => {
                  return (<LaunchTile launch={launch} height={20} width={30} indexCount={launchIndex}/>)
                })}
            </div>
            <div style={{gridColumn: 3, height: '100%', background: !showRightControl ? 'linear-gradient(270deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)' : width > 800 ? `url(${right}), url(${circle}), linear-gradient(270deg, rgba(47,46,65,1) 35%, rgba(63,61,86,0) 100%)` : `url(${right}), url(${circle})`, backgroundSize: '4rem', backgroundRepeat: 'no-repeat', backgroundPosition: 'right', zIndex: 1000}} onClick={() => { moveLaunches(true) }}/>
          </div>
        </div>}
      </React.Fragment>
    )
  }

  export default FutureLaunches;