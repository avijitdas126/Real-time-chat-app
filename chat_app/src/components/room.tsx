"use client";
import React, { useContext, useEffect, useState } from "react";
import { socket, uuid } from "./socket_con";
import moment from "moment";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ConversionContext from "@/context";
import ChatBox from "./input";
import Image from "next/image";
import { Message } from "../../../type";
export default function Room() {
  const {user}=useUser()
  const context = useContext(ConversionContext);

  if (!context) {
    throw new Error(
      "useConversionContext must be used within a ConversionProvider"
    );
  }
  const { conversion, setConversion } = context;
  const [allMessage, setallMessage] = useState<Message[]>([]);
  const [allunreadMsgs, setallunreadMsgs] = useState<Message[]>([]);

  useEffect(() => {
    socket.emit("request", {
      room: conversion?.room,
      from: conversion?.user_id,
    });
    socket.on("getMessagesByRoom", (data) => {
      setallMessage(data);
    });
  }, [conversion?.room, socket]);
useEffect(() => {
  // socket.emit('markAsRead', { room: conversion?.room, to:user?.id  });
}, [conversion?.room,user?.id ])

  useEffect(() => {
    socket.on("getUnreadMsgs", (data) => {
      setallunreadMsgs(data);
    });
  }, [socket]);

  const [msg, setmsg] = useState<
    {
      message: string;
      user_id: string;
      time: Date | number;
      room: string;
      reply_ID: string;
    }[]
  >([
    {
      message: "",
      user_id: "",
      time: 0,
      room: "",
      reply_ID: "",
    },
  ]);

  useEffect(() => {
    socket.on("serverMsg", ({ message, room, user_id, time, reply_ID }) => {
      // Ensure `time` and `reply_ID` are provided fallback values
      setmsg((prev) => [
        ...prev,
        {
          message: message || "",
          user_id: user_id || "",
          time: time ?? new Date(), // Fallback to current time if undefined
          room: room || "",
          reply_ID: reply_ID || "", // Fallback to empty string if undefined
        },
      ]);
    });
  }, []);

  return (
    <>
      {conversion ? (
        <React.Fragment key={"room"}>
          <div className="absolute top-0 left-0 p-2 bg-blue-600 w-full flex text-white items-center gap-3">
            <ArrowLeft className="cursor-pointer" />

            <img
              src={
                conversion?.icon ||
                "https://avatars.githubusercontent.com/u/123456789?v=4"
              }
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
            />
            <div>
              <h1 className="text-lg font-semibold">{conversion?.name}</h1>
              <p className="text-sm">last seen 2:30pm</p>
            </div>
          </div>
          <div className="grid mt-[75px] ">
            {allMessage.map((elem, i) => (
              <React.Fragment key={i}>
                {elem.user_id.length != 0 &&
                  (elem.user_id.includes(conversion.user_id) ? (
                    <div key={"child" + i} className="flex justify-end">
                      <div
                        className="grid justify-items-end bg-blue-200 max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                        id="own"
                      >
                        {elem.message}
                        <div className="text-xs text-slate-500">
                          {moment(elem.time).format("hh:mm A")}{" "}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={"child" + i} className="flex justify-start">
                      <div
                        className="grid justify-items-start bg-white max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                        id="others"
                      >
                        {elem.message}
                        <div className="text-sm text-slate-500">
                          {moment(elem.time).format("hh:mm A")}{" "}
                        </div>
                      </div>
                    </div>
                  ))}
              </React.Fragment>
            ))}

            {msg.map((elem, i) => (
              <React.Fragment key={i}>
                {elem.user_id.length != 0 &&
                  (elem.user_id.includes(conversion.user_id) ? (
                    <div key={"child" + i} className="flex justify-end">
                      <div
                        className="grid justify-items-end bg-blue-200 max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                        id="own"
                      >
                        {elem.message}
                        <div className="text-xs text-slate-500">
                          {moment(elem.time).format("hh:mm A")}{" "}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={"child" + i} className="flex justify-start">
                      <div
                        className="grid justify-items-end bg-white max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                        id="others"
                      >
                        {elem.message}
                        <div className="text-sm text-slate-500">
                          {moment(elem.time).format("hh:mm A")}{" "}
                        </div>
                      </div>
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>
          {/*    Code on unread Msg */}
          {allunreadMsgs.length > 0 && (
            <React.Fragment key={"unread-msgs"}>
              <div className="p-2 w-full flex text-black bg-[#ffffff79] items-center justify-center my-2 j gap-3">
                <span className="text-red-500 font-semibold">
                  {allunreadMsgs.length} Unread Messages
                </span>
              </div>
              {allunreadMsgs.map((elem, i) => (
                <div key={"child" + i} className="flex justify-start">
                  <div
                    className="grid justify-items-end bg-white max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                    id="others"
                  >
                    {elem.message}
                    <div className="text-sm text-slate-500">
                      {moment(elem.time).format("hh:mm A")}{" "}
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )}

          <ChatBox />
        </React.Fragment>
      ) : (
        <React.Fragment key={"empty-room"}>
          <div className="flex flex-col justify-center items-center w-full h-[70vh] mt-[10vh] text-center">
            <Image
              src="/chat.svg"
              alt="Chat"
              width={300}
              height={320}
              className="mb-4"
            />
            <p className="max-w-[220px] text-slate-600">
              Welcome to <strong>YapMe</strong> — connect, chat, and enjoy
              real-time conversations!
            </p>
          </div>
        </React.Fragment>
      )}
    </>
  );
}
