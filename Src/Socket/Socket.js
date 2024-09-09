import { io } from 'socket.io-client';
import { dispatchAction } from '../utils/apiGlobal';
import { ADD_ONE_MESSAGE } from '../Redux/ActionTypes';
import { getAsyncToken } from '../utils/AsyncStorage';

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

export const socketConnect = async (dispatch, next) => {
    if (socket !== null) { socket.disconnect(); }
    console.log("Making socket connection request..");
    let token = await getAsyncToken()
    socket = io('https://expresstest.indiansabroad.online/',
        {
            auth: {
                token: token,
                // token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZjAzZDZjYWUxZmY1MmVjZmM0NWQwNyIsInR5cGUiOiJhcHB1c2VyIiwiaWF0IjoxNzI1NjE1MjI2LCJleHAiOjE3Mjc2ODg4MjZ9.RRZvJJ1wk-7_x_rn2Ynhe4Qprym9LNeGlaBrl-lHOSY"
            }
        }
    );
    socket.on("connect", () => {
        console.log("-----------socket connected-----------");
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