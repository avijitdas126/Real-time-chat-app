"use client";
import { SendHorizonal } from "lucide-react";
import React, { useRef } from "react";
import { socket, uuid } from "./socket_con";

export default function ChatBox() {
  const sendMsg = (e: React.FormEvent) => {
    e.preventDefault();
    const message = chatbox.current?.value;
    if (!message) return;
    console.log(socket.id);
    // Emit message to server
    socket.emit("clientMsg", {
      message,
      room: "1",
      from: uuid,
      user_id: uuid,
      to: ["11111"],
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
            className="border-2 border-black px-2 py-1 border-solid w-[90%]  "
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
