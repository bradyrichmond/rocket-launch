import React from 'react';

import heart from '../images/heart.svg';

const Reminder = (props) => {
    return (
        <div className='reminder-container'>
            <p className='header'>Want a reminder?</p>
            <p className='subheader'>We will notify you with an email or browser reminder</p>
            <div className='reminder-email-container'>
                <input type='text' placeholder='Enter your email' />
                <div className='reminder-button' />
            </div>
            <div className='signature'>Created with <img src={heart} alt='love' style={{height: '1rem', width: '1rem'}}/> by Brady</div>
        </div>
    )
}

export default Reminder