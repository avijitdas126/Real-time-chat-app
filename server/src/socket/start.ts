/**
 * 
 * start socket from this module
 */

import { DefaultEventsMap, Server, Socket } from "socket.io";
import { ClientToServer, Message, ServerToClient, User } from "../../../type";
import { addActiveUser, addConversation, addMessage, deleteActiveUser, getActiveUser, getallMsgs, getConversation, getMessages, getUnreadMsgs, getUser, getUsers } from "../db/action";
import { Messages } from "../db/schema";

export default function SocketExcetion(io: Server<ClientToServer, ServerToClient, DefaultEventsMap, any>) {

    io.on('connection', (socket: Socket<ClientToServer, ServerToClient>) => {
        // addActiveUser('111111',socket.id)
        socket.on('connectUser', async ({ id, socket_id ,room}) => {
            addActiveUser(id, socket_id)
            // console.log(`Socket connected: ${socket.id} for user: ${id}`);
            const unread_Msg = await getUnreadMsgs(id,room);
            let getConversions = await getConversation(id); 

            // If no conversation, but messages exist, create them
            if (!getConversions?.length && unread_Msg?.length) {
                const roomSet = new Set<string>();

                for (const elem of unread_Msg) {
                    if (!roomSet.has(elem.room)) {
                        roomSet.add(elem.room);

                        const userdetails = await getUser(elem.from) as User;

                        await addConversation({
                            isGroup: false,
                            icon: userdetails.avatar,
                            user_id: id,
                            conversionId: userdetails.id,
                            unread_Msg: 0,
                            name: userdetails.name,
                            room: elem.room,
                        });
                    }
                }

                // Refresh conversions after creation
                getConversions = await getConversation(id);
            }

            // Emit data to the user
            socket.emit('getUnreadMsgs', unread_Msg);
            socket.emit('getConversion', getConversions);

        })
        socket.on('clientMsg', async({ from, user_id, reply_ID, to, message, room, time, is_to_readed, is_from_readed }) => {
            
           
            socket.join(room)
            let res =await addMessage({ from, to, reply_ID, message, user_id, is_to_readed:true, is_from_readed, room })
            console.log(socket.id + ' : ' + message)
            io.to(room).emit("serverMsg", { from, user_id, reply_ID, to, message, room, is_to_readed:true, is_from_readed })
            

            
            

        })
        socket.on('request', async ({ isSearch = false, room = null, from = '' }) => {
            if (isSearch) {
                let getUser = await getUsers();
                socket.emit('getAllUsers', getUser)
            }
            if (room) {
        const messages = await getMessages(room); // removed `from`
        socket.emit('getMessagesByRoom', messages);
            }
        })

        socket.on('addConversation', async ({ isGroup = false,
            icon,
            user_id,
            conversionId,
            unread_Msg = 0, name, room }) => {
            let conversion = await addConversation({
                isGroup,
                icon,
                user_id,
                conversionId,
                unread_Msg,
                name,
                room
            })

        })
socket.on('markAsRead', async ({ room, to }) => {
    try {
        // Mark all unread messages in the room as read for this user
        await Messages.updateMany(
            { room, to, is_to_readed: false },
            { $set: { is_to_readed: true } }
        );

        // Fetch updated unread messages
        const unread_Msg = await getUnreadMsgs(to='', room='');

        // Fetch updated conversations
        const getConversions = await getConversation(to);

        // Emit updated data to the client
        socket.emit('getUnreadMsgs', unread_Msg);
        socket.emit('getConversion', getConversions);
    } catch (error) {
        console.error('Error in markAsRead:', error);
    }
});

        socket.on('disconnect', () => {
            deleteActiveUser(socket.id)
            console.log(`Socket disconnected: ${socket.id}`);
            // Optionally remove user from DB
        });
    })
}