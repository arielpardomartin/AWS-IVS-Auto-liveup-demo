import React, { useEffect, useCallback, useRef, useState } from 'react';

import config from '../../config';
import canAutoPlay from 'can-autoplay';
import { createSocket } from '../../helpers/websocket';
import Placeholder from '../Placeholder';
import PlayerControls from '../PlayerControls';
import PlayerAutoPlayBlocked from '../PlayerAutoPlayBlocked';
import PlayerCountDown from '../PlayerCountDown';
import './PlayerIVS.css';

const PlayerIVS = ({ streamUrl }) => {
  const deviceDetect = require('react-device-detect');

  const { IVSPlayer } = window;
  const { isPlayerSupported } = IVSPlayer;
  const [showCountDown, setShowCountDown] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const [isVideoBlocked, setIsVideoBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [placeHolderStatus] = useState('loading');
  const [totalRemainingSeconds, setTotalRemainingSeconds] = useState(0);
  const [showLoading, setShowLoading] = useState(true);

  const player = useRef(null);
  const videoEl = useRef(null);
  const playerWrapper = useRef(null);
  const webSocket = useRef(null);

  // PLAYER EVENT LISTENERS
  const onStateChange = useCallback(() => {
    const playerState = player.current.getState();
    console.log(`Player State - ${playerState}`);
    setIsPlaying(playerState === IVSPlayer.PlayerState.PLAYING);
  }, [IVSPlayer.PlayerState]);

  const onError = (err) => {
    console.warn('Player Event - ERROR:', err);
  };

  const onRebuffering = () => {
    console.log('Player State - Rebuffering');
    player.current.setRebufferToLive(true);
  };

  const onFullScreenChange = () => {
    if (document.fullscreenElement) {
      setIsFullscreen(true);
    } else {
      setIsFullscreen(false);
    }
  };

  const AddEventListeners = useCallback(() => {
    const video = playerWrapper.current.getElementsByTagName('video')[0];

    player.current.addEventListener(IVSPlayer.PlayerState.READY, onStateChange);
    player.current.addEventListener(IVSPlayer.PlayerState.PLAYING, onStateChange);
    player.current.addEventListener(IVSPlayer.PlayerState.BUFFERING, onStateChange);
    player.current.addEventListener(IVSPlayer.PlayerState.IDLE, onStateChange);
    player.current.addEventListener(IVSPlayer.PlayerState.ENDED, onStateChange);
    player.current.addEventListener(IVSPlayer.PlayerEventType.ERROR, onError);
    player.current.addEventListener(IVSPlayer.PlayerEventType.REBUFFERING, onRebuffering);

    if (deviceDetect.isMobileSafari) {
      video.addEventListener('webkitendfullscreen', onFullScreenChange);
    } else if (deviceDetect.isSafari) {
      document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    } else {
      document.addEventListener('fullscreenchange', onFullScreenChange);
    }
  }, [IVSPlayer.PlayerState, IVSPlayer.PlayerEventType, deviceDetect.isMobileSafari, deviceDetect.isSafari, onStateChange]);

  const RemoveEventListeners = useCallback(() => {
    const video = playerWrapper.current.getElementsByTagName('video')[0];

    player.current.removeEventListener(IVSPlayer.PlayerState.READY, onStateChange);
    player.current.removeEventListener(IVSPlayer.PlayerState.PLAYING, onStateChange);
    player.current.removeEventListener(IVSPlayer.PlayerState.BUFFERING, onStateChange);
    player.current.removeEventListener(IVSPlayer.PlayerState.IDLE, onStateChange);
    player.current.removeEventListener(IVSPlayer.PlayerState.ENDED, onStateChange);
    player.current.removeEventListener(IVSPlayer.PlayerEventType.ERROR, onError);
    player.current.removeEventListener(IVSPlayer.PlayerEventType.REBUFFERING, onRebuffering);

    if (deviceDetect.isMobileSafari) {
      video.removeEventListener('webkitendfullscreen', onFullScreenChange);
    } else if (deviceDetect.isSafari) {
      document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
    } else {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
    }
  }, [IVSPlayer.PlayerState, IVSPlayer.PlayerEventType, deviceDetect.isMobileSafari, deviceDetect.isSafari, onStateChange]);

  useEffect(() => {
    if (!isPlayerSupported) {
      console.warn('The current browser does not support the Amazon IVS player.');
      return;
    }

    player.current = IVSPlayer.create();
    player.current.attachHTMLVideoElement(videoEl.current);

    AddEventListeners();

    player.current.load(streamUrl);

    // Ask if the browser allows autoplay with sound
    canAutoPlay.video({ muted: false, inline: true, timeout: 1000 }).then(({ result, error }) => {
      if (result) {
        player.current.play();
      } else {
        console.warn(error);
        setIsAudioBlocked(true);
        canAutoplayMuted();
      }
    });

    // Ask for autoplay without sound
    const canAutoplayMuted = () =>
      canAutoPlay.video({ muted: true, inline: true, timeout: 1000 }).then(({ result, error }) => {
        if (result) {
          player.current.setMuted(true);
          player.current.play();
        } else {
          setIsVideoBlocked(true);
        }
      });

    return () => {
      RemoveEventListeners();
    };
  }, [IVSPlayer, isPlayerSupported, streamUrl, AddEventListeners, RemoveEventListeners]);

  const onMessage = (message) => {
    if (!showCountDown && message.remainingSeconds) {
      setTotalRemainingSeconds(message.remainingSeconds);
      setShowCountDown(true);
    } else if (message.event_name === 'Stream Start' && message.channel_name === config.CHANNEL_NAME) {
      player.current.load(streamUrl);
      player.current.play();
    } else if (message.event_name === 'Stream End' && message.channel_name === config.CHANNEL_NAME) {
      setTotalRemainingSeconds(config.INTERVAL_SECONDS);
      setShowCountDown(true);
    }
  };

  useEffect(() => {
    webSocket.current = createSocket(
      config.WEBSOCKET_URL,
      onMessage
    );
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isPlaying){
      setShowCountDown(false);
      setShowLoading(false)
    }
  }, [isPlaying]);

  const toggleFullscreen = () => {
    const elem = document;
    const video = playerWrapper.current.getElementsByTagName('video')[0];
    if (isFullscreen) {
      if (elem.exitFullscreen) {
        elem.exitFullscreen();
      } else if (elem.webkitExitFullscreen) {
        /* Safari */
        elem.webkitExitFullscreen();
      } else if (elem.msExitFullscreen) {
        /* IE11 */
        elem.msExitFullscreen();
      } else if (video.webkitExitFullScreen) {
        /* IOS */
        video.webkitExitFullScreen();
      }
    } else {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        /* Safari */
        video.webkitRequestFullscreen();
      } else if (video.msRequestFullscreen) {
        /* IE11 */
        video.msRequestFullscreen();
      } else if (video.webkitEnterFullscreen) {
        /* IOS */
        video.webkitEnterFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const togglePause = () => {
    const shouldPause = !player.current.isPaused();

    if (shouldPause) {
      player.current.pause();
    } else {
      player.current.play();
    }

    setIsPaused(shouldPause);
  };

  // PLAY FUNCTION
  const startPlayback = () => {
    player.current.play();
    setIsVideoBlocked(false);
  };

  return (
    <div className='stream-wrapper' ref={playerWrapper}>
      <div className='player-container'>
        <div className='aspect-16x9'>
        { (showLoading && !isVideoBlocked && !showCountDown) && <Placeholder status={placeHolderStatus} />}
          <div className='player'>
            <video ref={videoEl} className='video-el' playsInline preload='metadata' crossOrigin='anonymous' />

            <div className='player-ui'>
              {showCountDown && 
                <PlayerCountDown  
                  totalRemainingSeconds={totalRemainingSeconds} 
                  setTotalRemainingSeconds={setTotalRemainingSeconds} 
                  setShowCountDown={setShowCountDown} 
                  />}

              {player.current && !showCountDown &&
                <PlayerControls
                  player={player.current}
                  toggleFullscreen={toggleFullscreen}
                  togglePause={togglePause}
                  isFullscreen={isFullscreen}
                  isPaused={isPaused}
                  startsMuted={isAudioBlocked}
                />}

              {isVideoBlocked &&
                <PlayerAutoPlayBlocked
                  startPlayback={startPlayback}
                />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerIVS;
