export interface ServerToClient{
    serverMsg:(data:{message:string,room:string})=>void
}

export interface ClientToServer{
    clientMsg:(data:{message:string,room:string})=>void,
    connectUser:(data:{id:string,socket_id:string})=>void
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
    conversionId:string,
    unread_Msg:number
}
export interface Message{
    from:string,
    to:string[],
    message:string,
    time:Date,
    attachment:string
}
export interface active_user{
 id:string,
 socket_id:string
}

