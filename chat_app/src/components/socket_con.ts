'use client'
import * as io from 'socket.io-client'
import { ClientToServer, ServerToClient } from '../../../type';
import { v4 as uuidv4 } from 'uuid'
import { useUser } from "@clerk/nextjs";
const socket: io.Socket<ServerToClient, ClientToServer> = io.connect(process.env.NEXT_PUBLIC_SOCKET_URL)
const uuid = uuidv4()
let except = (no: number, context: string | undefined | null): string => {
    if (context) {
        if (context?.length < no)
            return context.slice(0, no);
        else
            return context.slice(0, no) + '...';
    }
    return '';
}
export const NEXT_PUBLIC_SOCKET_URL=process.env.NEXT_PUBLIC_SOCKET_URL as string;
export const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string;
export const CLERK_SECRET_KEY=process.env.CLERK_SECRET_KEY as string;
export const NEXT_PUBLIC_CLOUD_NAME=process.env.NEXT_PUBLIC_CLOUD_NAME as string;
export const NEXT_PUBLIC_UPLOAD_PRESET=process.env.NEXT_PUBLIC_UPLOAD_PRESET as string;
export { socket, uuid, except };