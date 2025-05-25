export interface ServerToClient{
    serverMsg:(data:ClientMessage)=>void
}

export interface ClientToServer{
    clientMsg:(data:ClientMessage)=>void,
    connectUser:(data:{id:string,socket_id:string})=>void
}

export interface ClientMessage extends Message {
 room:string
}
export interface User{
    avatar:string,
    name:string,
    phone_no?:string,
    email:string,
    id:string,
    bio?:string
}

export interface Conversion{
    isGroup:boolean,
    users:string[],
    icon:string,
    id:string,
    user_id:string,
    conversionId:string,
    unread_Msg:number
}
export interface Message{
    from:string,
    to:string[],
    reply_ID?:string,
    message:string,
    id?:string,
    user_id:string,
    time?:Date,
    attachment?:string | null
}
export interface active_user{
 id:string,
 socket_id:string
}

