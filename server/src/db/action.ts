import mongoose from "mongoose"
import { Active_Users, Conversions, Messages, Users } from "./schema"
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

export const addMessage = async ({ from, to, reply_ID, message, user_id, attachment = null, is_to_readed,room }: Message): Promise<void> => {
  try {
    let addMessages = new Messages({ from, to, reply_ID, user_id, message, attachment, is_to_readed,room })
    let res = await addMessages.save()
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at addMessage : ' + error)
  }
}
export const getMessages = async (room: string,) => {
  try {
    let messages = await Messages.find({ room }).sort({ time: 1 }); // Sort by timestamp
    return messages;
  } catch (error) {
    console.log('Error at /db/action.ts at getMessages : ' + error)
    return null;
  }
}


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
    console.log(getConversation)
    return getConversation;
  } catch (error) {
    console.log('Error at /db/action.ts at getConversation : ' + error)
    return null;
  }
}

export const getActiveUser = async (id:string) :Promise<number>=> {
  try {
    let getActiveUser = await Active_Users.find({id});
    return (getActiveUser.length);
  } catch (error) {
    console.log('Error at /db/action.ts at getActiveUsers : ' + error)
    return 0;
  }
}

export const deleteConversation = async (id: string) => {
  try {
    let res = await Conversions.deleteOne({ id });
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

export const getUser = async ( id:string ) => {
  try {
    let getUser = await Users.findOne({ id })
    console.log(getUser)
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

export const getUnreadMsgs = async (to:string,room:string|undefined) => {
  try {
      const filter = { to, is_to_readed: false,room };
    
    const res = await Messages.find(filter);
    return res;
  }
   catch (error) {
    console.log('Error at /db/action.ts at getUnreadMsgs : ' + error)
  }
}
export const getallMsgs = async (room: string|undefined) => {
  try {
    let res = await Messages.find({ room });
    console.log(res);
    return res;
  } catch (error) {
    console.log('Error at /db/action.ts at getallMsgs : ' + error)
    return null;
  }
}