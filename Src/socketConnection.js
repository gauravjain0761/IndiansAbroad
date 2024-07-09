import {io} from 'socket.io-client';
import {api} from './utils/apiConstants';

const socket = io(api.BASE_URL, {
  transports: ['websocket'], // optional, use websocket transport only
});

export default socket;
