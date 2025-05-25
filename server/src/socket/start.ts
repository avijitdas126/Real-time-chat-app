/**
 * 
 * start socket from this module
 */

import { DefaultEventsMap, Server, Socket } from "socket.io";
import { ClientToServer, ServerToClient } from "../../../type";
import { addActiveUser, addMessage, deleteActiveUser } from "../db/action";

export default function SocketExcetion(io: Server<ClientToServer, ServerToClient, DefaultEventsMap, any>) {

    io.on('connection', (socket: Socket<ClientToServer, ServerToClient>) => {
        // addActiveUser('111111',socket.id)
        socket.on('connectUser', ({ id, socket_id }) => {
            // addActiveUser(id, socket_id)
            // console.log(`Socket connected: ${socket.id} for user: ${id}`);
        })
        socket.on('clientMsg', ({from,user_id,reply_ID,to, message, room,time }) => {
            if (room === "") {
                io.sockets.emit('serverMsg', {from,user_id,reply_ID,to,message, room,time })
            }
            else {
                socket.join(room)
                addMessage({from, to, reply_ID, message,user_id})
                console.log(socket.id + ' : ' + message)
                io.to(room).emit("serverMsg", {from,user_id,reply_ID,to,message, room  })
            }
        })

        socket.on('disconnect', () => {
            deleteActiveUser(socket.id)
            console.log(`Socket disconnected: ${socket.id}`);
            // Optionally remove user from DB
        });
    })
}