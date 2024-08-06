import { io } from 'socket.io-client';
import { dispatchAction } from '../utils/apiGlobal';
import { ADD_ONE_MESSAGE } from '../Redux/ActionTypes';

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
        dispatchAction(dispatch, ADD_ONE_MESSAGE, data)
        console.log('msgReceive---', data);
    });
    socket.on('msgReceiveSelf', data => {
        dispatchAction(dispatch, ADD_ONE_MESSAGE, data)
        console.log('msgReceiveSelf----', data);
    });
    socket.on('joinRoom', data => {
        console.log('joinRoom---', data);
    });
    socket.on('userOnline', data => {
        console.log('userOnline---', data);
    });
    socket.on('messageDeleted', data => {
        console.log('messageDeleted---', data);
    });
};