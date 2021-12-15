import React, { useEffect, useState, useRef } from 'react';

import './PlayerCountDown.css';

const PlayerCountDown = ({ totalRemainingSeconds, setTotalRemainingSeconds, setShowCountDown }) => {
  const [remainingSecondsToDisplay, setRemainingSecondsToDisplay] = useState(0);
  const [remainingMinutesToDisplay, setRemainingMinutesToDisplay] = useState(0);
  const [remainingHoursToDisplay, setRemainingHoursToDisplay] = useState(0);
  const [countDownFinished, setCountDownFinished] = useState(false)

  const timerInterval = useRef(null);

  useEffect(() => {
    setRemainingSecondsToDisplay(totalRemainingSeconds % 60);
    setRemainingMinutesToDisplay(Math.floor(totalRemainingSeconds / 60));
    setRemainingHoursToDisplay(Math.floor(totalRemainingSeconds / (60 * 60)));
  }, [totalRemainingSeconds]);

  useEffect(() => {
    timerInterval.current = setInterval(() => {
      if (totalRemainingSeconds > 0) {
        setTotalRemainingSeconds(totalRemainingSeconds - 1);
      } else {
        setCountDownFinished(true);
      }
    }, 1000);
    return () => clearInterval(timerInterval.current);
  });

  const formatNumberWithLeadingZero = (number) => String(number).padStart(2, '0');

  return (
    <div className='container'>
      <h2> {countDownFinished ? 'Live stream starting...' : 'Live stream starts in' }</h2>
      { !countDownFinished ?
        <div className='content'>
          <div className='box'>
            <div className='hours'> {formatNumberWithLeadingZero(remainingHoursToDisplay)} </div>
            <span>Hours</span>
          </div>

          <div className='box'>
            <div className='minutes'>{formatNumberWithLeadingZero(remainingMinutesToDisplay)}</div>
            <span>Minutes</span>
          </div>

          <div className='box'>
            <div className='seconds'>{formatNumberWithLeadingZero(remainingSecondsToDisplay)}</div>
            <span>Seconds</span>
          </div>
        </div> : ''}

    </div>
  );
};

export default PlayerCountDown;
