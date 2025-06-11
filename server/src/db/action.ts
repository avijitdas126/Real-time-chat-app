import mongoose from "mongoose"
import { Active_Users, Conversions, DeleteMsgs, Messages, Users } from "./schema"
import { Conversion, Message, User } from "../../../type"

/**
 * @function addActiveUser works add active user
 * @param id 
 * @param socket_id 
 */

export const addActiveUser = async (id: string, socket_id: string): Promise<void> => {
  try {
    let addUser = new Active_Users({ id, socket_id })
    let res = await addUser.save()
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at addActiveUser : ' + error)
  }
}
/**
 * @function deleteActiveUser works delete inactive user
 * @param socket_id 
 */

export const deleteActiveUser = async (socket_id: string): Promise<void> => {
  try {
    let res = await Active_Users.deleteOne({ socket_id })
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at deleteActiveUser : ' + error)
  }
}

export const addMessage = async ({ from, to, reply_ID, message, user_id, attachment = null, is_to_readed, room }: Message): Promise<void> => {
  try {
    let addMessages = new Messages({ from, to, reply_ID, user_id, message, attachment, is_to_readed, room })
    let res = await addMessages.save()
    let del = new DeleteMsgs({ id: res.id, room })
    let delRes = await del.save()
    console.log(delRes)
  } catch (error) {
    console.log('Error at /db/action.ts at addMessage : ' + error)
  }
}
export const getMessages = async (
  room: string,
  currentUserId: string
) => {
  try {
    // Get messages where:
    // - User is sender (`from`)
    // - OR User is receiver (`to`) and message is read or unread
    const messages = await Messages.find({
      room,
      $or: [
        { from: currentUserId },
        { to: currentUserId },
      ]
    })
      .sort({ time: 1 }) // Oldest to newest
      .lean();
    // const deleted = await DeleteMsgs.find({ room }).lean();
    // Create a Set of deleted message UUIDs
    // Add custom `readStatus` field for frontend display
    let taggedMessages = messages.map(msg => {
      if (msg.to === currentUserId) {
        return { ...msg, readStatus: msg.is_to_readed ? 'read' : 'unread' };
      }
      return msg; // Sender messages don’t need tag
    });


    return taggedMessages;

  } catch (error) {
    console.error(`Error in getMessagesFiltered for room "${room}":`, error);
    return [];
  }
};



export const addConversation = async ({ isGroup = false,
  icon,
  user_id,
  conversionId,
  unread_Msg = 0, name, room }: Conversion) => {
  try {
    let addConversation = new Conversions({ isGroup, icon, user_id, conversionId, unread_Msg, name, room })
    let res = await addConversation.save()
    console.log(res)
    return res;
  } catch (error) {
    console.log('Error at /db/action.ts at addConversation : ' + error)
  }

}

export const getConversation = async (user_id: string) => {
  try {
    let getConversation = await Conversions.find({ user_id });

    const result = await Promise.all(getConversation.map(async (conv) => {
      let lastMsgs = await Messages.find({ room: conv.room })
      const n = lastMsgs.length
      let lastMsg = lastMsgs[n - 1]
      const unreadCount = await Messages.countDocuments({ room: conv.room, to: user_id, is_to_readed: false })
      if (lastMsg.attachment) {
        lastMsg.message = "Image"
      }
      return {
        ...conv.toObject(),
        lastMessage: lastMsg || null,
        unread_Msg: unreadCount
      }
    }))
    // console.log(getConversation)
    return result;
  } catch (error) {
    console.log('Error at /db/action.ts at getConversation : ' + error)
    return null;
  }
}

export const getActiveUser = async (id: string): Promise<number> => {
  try {
    let getActiveUser = await Active_Users.find({ id });
    return (getActiveUser.length);
  } catch (error) {
    console.log('Error at /db/action.ts at getActiveUsers : ' + error)
    return 0;
  }
}

export const deleteConversation = async (id: string[]) => {
  try {
    let res = await Conversions.deleteMany({ id });
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at deleteConversation : ' + error)
  }
}

export const deleteMessage = async (id: string) => {
  try {
    let res = await Messages.deleteOne({ id });
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at deleteMessage : ' + error)
  }
}

export const updateUnreadMsg = async (id: string, unread_Msg: number) => {
  try {
    let res = await Conversions.updateOne({ id }, { unread_Msg });
  } catch (error) {
    console.log('Error at /db/action.ts at updateUnreadMsg : ' + error)
  }
}

export const addUser = async ({ avatar, name, phone_no = '', email, id, bio = '' }: User) => {
  try {
    let addUser = new Users({ avatar, name, phone_no, email, id, bio })
    let res = await addUser.save()
    return res;
  } catch (error) {
    console.log('Error at /db/action.ts at addUser : ' + error)
  }

}

export const getUser = async (id: string) => {
  try {
    let getUser = await Users.findOne({ id })
    return getUser;
  } catch (error) {
    console.log('Error at /db/action.ts at getUser : ' + error)
  }
}

export const getUsers = async () => {
  try {
    let getUsers = await Users.find({})
    return getUsers;
  } catch (error) {
    console.log('Error at /db/action.ts at getUsers : ' + error)
  }
}

export const getUnreadMsgs = async (to: string) => {
  try {
    const filter = { to, is_to_readed: false };

    const res = await Messages.find(filter);
    return res;
  }
  catch (error) {
    console.log('Error at /db/action.ts at getUnreadMsgs : ' + error)
  }
}
export const getallMsgs = async (room: string | undefined) => {
  try {
    let res = await Messages.find({ room });
    console.log(res);
    return res;
  } catch (error) {
    console.log('Error at /db/action.ts at getallMsgs : ' + error)
    return null;
  }
}

export const getUnfriendUsers = async (id: string,) => {
  try {
    let getUsers = await Conversions.find({ user_id: id })
    const friends = getUsers.map((e) => e.conversionId)
    friends.push(id)
    let unfriends = await Users.find({
      id: { $nin: friends }
    }).lean()
    return unfriends;
  } catch (error) {
    console.log('Error at /db/action.ts at getUnfriendUsers : ' + error)
  }
}

export const updateConversion = async (room: string) => {
  try {
    let updateConversion = await Conversions.updateMany({ room: room }, { $set: { time: Date.now() } })
    console.log(updateConversion)
  } catch (error) {
    console.log('Error at /db/action.ts at updateConversion : ' + error)
  }
}

export const updateUser = async (id: string, bio: string, avatar: string, phone_no: string) => {
  try {

    let user = await Users.updateOne({ id }, { $set: { bio, avatar, phone_no } })
    if (avatar) {
      let res = await Conversions.updateMany({ conversionId: id }, { $set: { icon: avatar } })
    }
    return user
  } catch (error) {
    console.log('Error at /db/action.ts at updateUser : ' + error)
  }
}

export const deleteMsgs = async (id: string[], room: string, user_id: string) => {
  try {

    const bulkOps = id.map(item => ({
      updateOne: {
        filter: { userId: item }, // check if exists by this field
        update: { $set: { id, room, user_id } },
        upsert: true, // create if not exists
      }
    }));
    let delMsg = await DeleteMsgs.bulkWrite(bulkOps);
    console.log(delMsg)
    return delMsg


  } catch (error) {
    console.log('Error at /db/action.ts at deleteMsgs : ' + error)
  }
}
