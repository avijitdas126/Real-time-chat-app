import mongoose from "mongoose"
import { Active_Users } from "./schema"

export const addActiveUser=async (id:string,socket_id:string):Promise<void>=>{
  try {
    let addUser=new Active_Users({ id, socket_id })
    let res=await addUser.save()
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at addActiveUser : ' + error)
  }
}
export const deleteActiveUser=async (socket_id:string):Promise<void>=>{
  try {
    let res=await Active_Users.deleteOne({socket_id})
    console.log(res)
  } catch (error) {
    console.log('Error at /db/action.ts at deleteActiveUser : ' + error)
  }
}