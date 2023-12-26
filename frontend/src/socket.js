import { io } from 'socket.io-client';

export const socket = io.connect("https://games-website-whhe.onrender.com/");