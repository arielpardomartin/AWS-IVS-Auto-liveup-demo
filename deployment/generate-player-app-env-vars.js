const fs = require('fs');

const STACK_OUTPUT_FILE_PATH = process.argv[2];
const ENV_FILE_PATH = '../web-ui/player-app/.env';
const CONFIG_FILE_PATH = '../configuration/config.json';

// Function to filter stack.json outputs by output key
const findOutput = (outputs, key) => {
    return outputs.filter((output) => {
        return output.OutputKey === key;
    })[0].OutputValue;
};

const generatePlayerAppEnvVars = async () => {

    // Read stack.json file and get outputs section
    const stackInfo = JSON.parse(fs.readFileSync(STACK_OUTPUT_FILE_PATH, 'utf8'));
    const cloudformationOutputs = stackInfo.Stacks[0].Outputs;
    if (!cloudformationOutputs) {
        console.log('\n\nCloudFormation output file was not generated correctly, please execute deployment again...');
        process.exit(1);
    }

    // Read config.json file
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE_PATH, 'utf8'));
    if (!config) {
        console.log('\n\nError when reading "/configuration/config.json" file, please check the file exists and execute script again...');
        process.exit(2);
    }

    // Get value for REACT_APP_STREAM_PLAYBACK_URL
    const REACT_APP_STREAM_PLAYBACK_URL = findOutput(
        cloudformationOutputs,
        'StreamPlaybackURL'
    );

    // Get value for REACT_APP_WEBSOCKET_URL
    const REACT_APP_WEBSOCKET_URL = findOutput(
        cloudformationOutputs,
        'ReaderWebSocketURL'
    );

    // Get value for REACT_APP_CHANNEL_NAME
    const REACT_APP_CHANNEL_NAME = findOutput(
        cloudformationOutputs,
        'IVSChannelName'
    );

    // Get value for REACT_APP_INTERVAL_SECONDS
    const REACT_APP_INTERVAL_SECONDS = config.intervalSeconds;


    // Create .env file with environment variables
    let envFile = `REACT_APP_STREAM_PLAYBACK_URL=${REACT_APP_STREAM_PLAYBACK_URL}\n`;
    envFile += `REACT_APP_WEBSOCKET_URL=${REACT_APP_WEBSOCKET_URL}\n`;
    envFile += `REACT_APP_CHANNEL_NAME=${REACT_APP_CHANNEL_NAME}\n`;
    envFile += `REACT_APP_INTERVAL_SECONDS=${REACT_APP_INTERVAL_SECONDS}`;


    // Write .env file
    fs.writeFileSync(ENV_FILE_PATH, envFile);
};

generatePlayerAppEnvVars();