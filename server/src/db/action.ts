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

export const addMessage = async ({ from, to, reply_ID, message, user_id, attachment = null }: Message): Promise<void> => {
  try {
    let addMessages = new Messages({ from, to, reply_ID, user_id, message, attachment })
    let res = await addMessages.save()
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at addMessage : ' + error)
  }
}
export const getMessages = async (user_id: string) => {
  try {
    let getMessages = await Messages.find({ user_id });
    console.log(getMessages)
    return getMessages;
  } catch (error) {
    console.log('Error at /db/action.ts at getMessages : ' + error)
    return null;
  }
}

export const addConversation = async ({ isGroup = false, users,
  icon,
  user_id,
  conversionId,
  unread_Msg = 0 }: Conversion) => {
  try {
    let addConversation = new Conversions({ isGroup, users, icon, user_id, conversionId, unread_Msg })
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

export const getActiveUsers = async () => {
  try {
    let getActiveUsers = await Active_Users.find();
    console.log(getActiveUsers)
    return getActiveUsers;
  } catch (error) {
    console.log('Error at /db/action.ts at getActiveUsers : ' + error)
    return null;
  }
}

export const deleteConversation = async (conversionId: string) => {
  try {
    let res = await Conversions.deleteOne({ conversionId });
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

export const updateUnreadMsg = async (conversionId: string, unread_Msg: number) => {
  try {
    let res = await Conversions.updateOne({ conversionId }, { unread_Msg });
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at updateUnreadMsg : ' + error)
  }
}

export const addUser = async ({ avatar, name, phone_no = '', email, id, bio = '' }: User) => {
  try {
    let addUser = new Users({ avatar, name, phone_no, email, id, bio })
    let res = await addUser.save()
    console.log(res)
    return res;
  } catch (error) {
    console.log('Error at /db/action.ts at addUser : ' + error)
  }

}