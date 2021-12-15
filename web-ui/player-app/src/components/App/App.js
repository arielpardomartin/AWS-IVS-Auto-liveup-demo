import React from 'react';
import PlayerIVS from '../PlayerIVS';
import config from '../../config';
import './App.css';

const App = () => {
  return (
    <div className='App'>
      <PlayerIVS streamUrl={config.STREAM_PLAYBACK_URL} />
    </div>
  );
};

export default App;
