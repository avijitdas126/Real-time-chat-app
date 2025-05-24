'use client'
import * as io from 'socket.io-client'
import { ClientToServer, ServerToClient } from '../../../type';

const socket :io.Socket<ServerToClient,ClientToServer>=io.connect(process.env.NEXT_PUBLIC_SOCKET_URL)
export default socket;