"use client";
import { SendHorizonal } from "lucide-react";
import React, { useContext, useRef } from "react";
import { socket, uuid } from "./socket_con";
import ConversionContext from "@/context";
export default function ChatBox() {
    const context = useContext(ConversionContext);

if (!context) {
  throw new Error("useConversionContext must be used within a ConversionProvider");
}
const { conversion, setConversion } = context;
console.log(conversion); 
  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    const message = chatbox.current?.value;
    if (!message) return;
    console.log(socket.id); 
    // Emit message to server
    socket.emit("clientMsg", {
      message,
      time: new Date(),
      room: conversion!.room,
      from: conversion!.user_id, 
      user_id: conversion!.user_id,
      to: conversion!.conversionId,
      is_to_readed: false,
      is_from_readed: true
    });
    chatbox.current!.value = "";
  };
  const chatbox = useRef<HTMLInputElement>(null);
  return (
    <>
      <div className='absolute bottom-0 w-full '>
        <div className="flex gap-2 m-2 justify-center">
          <input
            type="text"
            ref={chatbox}
            className="border-1 border-black px-2 rounded py-1 border-solid w-[90%]  "
            placeholder="Message"
          />
          <button
            onClick={sendMsg}
            className="bg-blue-600 text-white px-2 rounded"
          >
            <SendHorizonal />
          </button>
        </div>
      </div>
    </>
  );
}
