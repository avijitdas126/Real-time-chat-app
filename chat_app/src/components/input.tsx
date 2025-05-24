"use client"
import { SendHorizonal } from 'lucide-react'
import React, { useRef } from 'react'
import socket from './socket_con';


export default function ChatBox() {
   const sendMsg=(e:React.FormEvent)=>{
   e.preventDefault();
   const message = chatbox.current?.value;
    if (!message) return;
    console.log(socket.id)
    // Emit message to server
    socket.emit('clientMsg', {
      message,
      room: '1',
    });
    
   }
    const chatbox = useRef<HTMLInputElement>(null)
  return (
    <>
    <div className='flex w-[50%] gap-2 m-2'>
        
<input type="text"  ref={chatbox} className='border-2 border-black px-2 py-1 border-solid lg:w-[40%] ' placeholder='Message'/> 
    <button onClick={sendMsg} className='bg-blue-600 text-white px-2 rounded'><SendHorizonal/></button>
    </div>
    
    </>
  )
}
