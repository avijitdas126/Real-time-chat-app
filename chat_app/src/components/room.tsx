"use client"
import React, { useEffect, useState } from 'react'
import socket from './socket_con'

export default function Room() {
    const [msg, setmsg] = useState<string[]>([])
    useEffect(() => {
      
    socket.on('serverMsg',({message,room})=>{
       setmsg([...msg! ,message])
    })
      
    }, [socket,msg])
    
  return (
    <>
  {
  msg.map((elem, i) => (
    <div key={i}>
      {elem}
    </div>
  ))
}
    </>
  )
}
