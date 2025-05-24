/**
 * 
 * start socket from this module
 */

import { DefaultEventsMap, Server, Socket } from "socket.io";
import { ClientToServer, ServerToClient } from "../../../type";
import { addActiveUser, deleteActiveUser } from "../db/action";

export default function SocketExcetion(io: Server<ClientToServer, ServerToClient, DefaultEventsMap, any>) {

    io.on('connection', (socket: Socket<ClientToServer, ServerToClient>) => {
        // addActiveUser('111111',socket.id)
        socket.on('connectUser', ({ id, socket_id }) => {
            addActiveUser(id, socket_id)
        })
        socket.on('clientMsg', ({ message, room }) => {
            if (room === "") {
                io.sockets.emit('serverMsg', { message, room })
            }
            else {
                socket.join(room)
                console.log(socket.id + ' : ' + message)
                io.to(room).emit("serverMsg", { message, room })
            }
        })

        socket.on('disconnect', () => {
            deleteActiveUser(socket.id)
            console.log(`Socket disconnected: ${socket.id}`);
            // Optionally remove user from DB
        });
    })
}