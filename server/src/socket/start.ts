/**
 * 
 * start socket from this module
 */

import { DefaultEventsMap, Server, Socket } from "socket.io";
import { ClientToServer, Message, ServerToClient, User } from "../../../type";
import { addActiveUser, addConversation, addMessage, deleteActiveUser, getActiveUser, getallMsgs, getConversation, getMessages, getUnreadMsgs, getUser, getUsers } from "../db/action";
import { Conversions, Messages } from "../db/schema";

export default function SocketExcetion(io: Server<ClientToServer, ServerToClient, DefaultEventsMap, any>) {

    io.on('connection', (socket: Socket<ClientToServer, ServerToClient>) => {
        // addActiveUser('111111',socket.id)
        socket.on('connectUser', async ({ id, socket_id, room }) => {
            // addActiveUser(id, socket_id)
            // console.log(`Socket connected: ${socket.id} for user: ${id}`);
            const unread_Msg = await getUnreadMsgs(id);
            let getConversions = await getConversation(id);
            console.log(id, ' : ', unread_Msg, ' : ', getConversions);
            // If no conversation, but messages exist, create them
            if (unread_Msg?.length) {
                const roomSet = new Set<string>();

                for (const elem of unread_Msg) {
                    // Check if the room already exists in the set
                    let isConversionPresent = await Conversions.find({ room: elem.room, user_id: id })
                    if (!isConversionPresent.length) {


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
                }

                // Refresh conversions after creation
                getConversions = await getConversation(id);
            }

            // Emit data to the user
            // socket.emit('getUnreadMsgs', unread_Msg);
            socket.emit('getConversion', getConversions);

        })
        socket.on('clientMsg', async ({ from, user_id, reply_ID, to, message, room, time, is_to_readed, is_from_readed }) => {
            socket.join(room)

            // Check if 'to' is active in the room
            const clientsInRoom = await io.in(room).fetchSockets();
            const recipientActive = clientsInRoom.some(s => s.id !== socket.id);

            is_to_readed = recipientActive;
            is_from_readed = true;

            let res = await addMessage({ from, to, reply_ID, message, user_id,time, is_to_readed, is_from_readed, room })
            console.log(socket.id + ' : ' + message)
             // Update unread count for receiver if not active
            if (!recipientActive) {
                await Conversions.updateOne(
                    { user_id: to, room },
                    { $inc: { unread_Msg: 1 } },
                    { upsert: true }
                );
            }

            io.to(room).emit("serverMsg", { from, user_id, reply_ID, to, message, room, is_to_readed, is_from_readed })
        })
        socket.on('request', async ({ isSearch = false, room = null, id='' }) => {
            if (isSearch) {
                let getUser = await getUsers();
                socket.emit('getAllUsers', getUser)
            }
            if (room) {
                const messages = await getMessages(room, id); // removed `from`
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