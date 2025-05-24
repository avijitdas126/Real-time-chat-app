"use client"
import React, { useEffect } from 'react'
import socket from './socket_con'


export default function Conversion() {
    useEffect(() => {
  
    socket.emit('connectUser', {
      id: '11111',
      socket_id: socket.id!,
    });
  });
    // socket.emit('connectUser',{id:'11111', socket_id: socket.id })
  return (
    <>
    
    </>
  )
}
