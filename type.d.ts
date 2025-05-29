export interface ServerToClient {
    serverMsg: (data: Message) => void,
    getAllUsers: (data) => void,
    getConversion: (data) => void,
    getMessagesByRoom:(data)=>void,
    getUnreadMsgs:(data)=>void,
}

export interface ClientToServer {
    clientMsg: (data: Message) => void,
    connectUser: (data: { id: string, socket_id: string,room?:string }) => void,
    request: (data: { isSearch?: boolean,room ?:string,id?:string}) => void, 
    addConversation: (data: Conversion) => void,
    markAsRead:(data:{ room?:string, to?:string })=>void
}

export interface User {
    avatar: string,
    name: string,
    phone_no?: string,
    email: string,
    id: string,
    bio?: string
}

export interface Conversion {
    isGroup: boolean,
    room: string,
    icon: string,
    id?: string,
    user_id: string,
    conversionId: string,
    unread_Msg?: number,
    name: string
}
export interface Message {
    from: string,
    to: string,
    reply_ID?: string,
    message: string,
    room: string,
    id?: string,
    user_id: string,
    time?: Date,
    attachment?: string | null,
    is_to_readed: boolean,
    is_from_readed?: boolean
}
export interface active_user {
    id: string,
    socket_id: string
}

