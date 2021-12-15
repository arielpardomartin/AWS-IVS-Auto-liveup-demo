import React, { useEffect, useState } from 'react';

import {
  Play,
  Pause,
  VolumeOff,
  VolumeUp,
  Fullscreen,
  ExitFullscreen
} from '../../assets/icons';

const PlayerControls = ({ player, toggleFullscreen, togglePause, isFullscreen, isPaused, startsMuted }) => {
  const [muted, setMuted] = useState(startsMuted);

  useEffect(() => {
    setMuted(player.isMuted());
  }, [player]);

  useEffect(() => {
    setMuted(startsMuted);
  }, [startsMuted]);

  const toggleMute = () => {
    const shouldMute = !player.isMuted();

    player.setMuted(shouldMute);
    setMuted(shouldMute);
  };

  return (
    <div className='player-ui-controls'>
      <div className='player-ui-controls__actions player-ui-controls__actions--left'>
        <button className='player-ui-button' onClick={togglePause}>
          {isPaused ? <Play /> : <Pause />}
        </button>

        <button className='player-ui-button' onClick={toggleMute}>
          {muted ? <VolumeOff /> : <VolumeUp />}
        </button>
      </div>

      <div className='player-ui-controls__actions player-ui-controls__actions--right'>
        <button className='player-ui-button' onClick={toggleFullscreen}>
          {isFullscreen ? <ExitFullscreen /> : <Fullscreen />}
        </button>
      </div>
    </div>
  );
};

export default PlayerControls;
