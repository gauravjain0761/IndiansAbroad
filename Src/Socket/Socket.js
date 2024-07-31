import { io } from 'socket.io-client';

let socket = null;
export { socket };

export const sendData = (event, data, dispatch) => {
    socket.emit(event, data);
    // if (dispatch != "") {
    //   dispatch({
    //     type: "LOADING",
    //     payload: true,
    //   });
    // }
};



export const socketConnect = (dispatch, next) => {
    if (socket !== null) {
        socket.disconnect();
    }
    console.log("Making socket connection request..");
    socket = io('https://express.indiansabroad.online/');
    socket.on("connect", () => {
        console.log("-----------socket connected-----------");
        //   dispatch({
        //     type: "SOCKET_CONNECTION",
        //     payload: socket.connected,
        //     socket: socket,
        //   });
        next(socket.connected);
    });
    socket.on("disconnect", () => {
        console.log("-----------socket disconnect-----------");
    });
    socket.on('msgReceive', data => {
        console.log('msgReceive', data);
    });
    socket.on('msgReceiveSelf', data => {
        console.log('damsgReceiveSelfta', data);
    });
    socket.on('joinRoom', data => {
        console.log('joinRoom', data);
    });
};