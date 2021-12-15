const WebSocketManager = require("./webSocketManager");

const INTERVAL_SECONDS = parseFloat(process.env.INTERVAL_SECONDS);
const MESSAGE_FREQUENCY = 1000;
const WRITER_WEBSOCKET_SENDMESSAGE_ROUTE = "sendmessage";

const webSocketManager = new WebSocketManager(process.env.WEBSOCKET_URL);
webSocketManager.connect();

let intervalSeconds = INTERVAL_SECONDS;

const sendMessageToConnectedClients = () => {
    const data = {
        remainingSeconds: intervalSeconds--
    };
    const payload = {
        action: WRITER_WEBSOCKET_SENDMESSAGE_ROUTE,
        data
    }
    webSocketManager.send(payload);
};

setInterval(sendMessageToConnectedClients, MESSAGE_FREQUENCY);