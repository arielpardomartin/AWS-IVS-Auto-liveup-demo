const RECONNECTION_TIMEOUT = 100;

const createSocket = (url, onMessage) => {
  let socket;

  try {
    /* eslint-disable no-undef */
    socket = new WebSocket(url);

    socket.onopen = () => console.info(`[Websocket onopen event] Connected to URL: ${url}`);

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.info(`[Websocket onclose event] Connection closed cleanly:\n* url=${url}\n* code=${event.code}\n* reason=${event.reason}`);
      } else {
        console.info('[Websocket onclose event] Connection died');
        setTimeout(() => createSocket(url, onMessage), RECONNECTION_TIMEOUT);
      }
    };

    socket.onerror = (error) => console.error(`[Websocket onerror event] ${error}`);

    socket.onmessage = event => {
      console.info(`[Websocket onmessage event] ${event.data}`);
      const data = JSON.parse(event.data);
      onMessage(data);
    };
  } catch (err) {
    console.error(`[Websocket error] ${err.message}`);
  }

  return socket;
};

export { createSocket };