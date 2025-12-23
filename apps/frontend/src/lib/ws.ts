let socket: WebSocket | null = null;

export const connectWS = (token: string, onMessage: (data: any) => void) => {
  if (socket) return socket;

  socket = new WebSocket(
    `${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`
  );

  socket.onmessage = (event) => {
    onMessage(JSON.parse(event.data));
  };

  socket.onclose = () => {
    socket = null;
  };

  return socket;
};

export const disconnectWS = () => {
  socket?.close();
  socket = null;
};
