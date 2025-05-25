'use client'
import * as io from 'socket.io-client'
import { ClientToServer, ServerToClient } from '../../../type';
import {v4 as uuidv4} from 'uuid'
import { useUser } from "@clerk/nextjs";
const socket :io.Socket<ServerToClient,ClientToServer>=io.connect(process.env.NEXT_PUBLIC_SOCKET_URL)
 const uuid=uuidv4()
export { socket, uuid };