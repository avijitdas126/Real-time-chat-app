"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { socket, uuid } from "./socket_con";
import moment from "moment";
import { ArrowLeft, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import ConversionContext from "@/context";
import ChatBox from "./input";
import Image from "next/image";
import { Message } from "../../../type";
import Link from "next/link";
export default function Room() {
  const { user } = useUser();
  const context = useContext(ConversionContext);

  if (!context) {
    throw new Error(
      "useConversionContext must be used within a ConversionProvider"
    );
  }

  interface FilteredMsg extends Message {
    readStatus: "unread" | "read";
  }

  const { conversion, setConversion } = context;
  const [allMessage, setallMessage] = useState<Map<string, FilteredMsg[]>>(
    new Map()
  );
  const [OpenImage, setOpenImage] = useState(false);
  const [allKeyMsg, setallKeyMsg] = useState<string[]>([]);
  const [selectImage, setselectImage] = useState("/blank.png");
  const [allunreadMsgs, setallunreadMsgs] = useState<
    Map<string, FilteredMsg[]>
  >(new Map());
  const [allKeyUnMsg, setallKeyUnMsg] = useState<string[]>([]);
  const [count, setcount] = useState<number>(0);
  const showMsg = useRef<HTMLDivElement>(null);
  const format = (messages: FilteredMsg[]) => {
    const Msg = new Map<string, FilteredMsg[]>();
    messages.map((message) => {
      if (message.time) {
        const now = moment();
        const date = moment(message.time);

        let key = "";
        if (date.isSame(now, "day")) {
          key = "Today";
        } else if (date.isSame(now.clone().subtract(1, "day"), "day")) {
          key = "Yesterday";
        } else {
          key = date.format("MMM DD, YYYY");
        }
        const existing = Msg.get(key) || [];
        Msg.set(key, [...existing, message]);
      }
    });
    return Msg;
  };
  const onHandle = (attachment: string | undefined | null) => {
    if (attachment) {
      setOpenImage(!OpenImage);
      setselectImage(attachment);
    }
  };

  useEffect(() => {
    socket.emit("request", {
      room: conversion?.room,
      id: conversion?.user_id,
    });
    socket.on("getMessagesByRoom", (data: FilteredMsg[]) => {
      const unreadMsgs = data.filter(
        (m) => m.readStatus === "unread" && m.to === user?.id
      );
      const readMsgs = data.filter(
        (m) => m.readStatus !== "unread" || m.from === user?.id
      );
      const allMsg = format(readMsgs);
      setallMessage(allMsg);
      setallKeyMsg(Array.from(allMsg.keys()));
      const count1 = unreadMsgs.length;
      setcount(count1);
      const allUnMsg = format(unreadMsgs);
      setallunreadMsgs(allUnMsg);
      setallKeyUnMsg(Array.from(allUnMsg.keys()));
    });
  }, [conversion?.room, socket]);
  useEffect(() => {
    socket.emit("markAsRead", { room: conversion?.room, to: user?.id });
  }, [conversion?.room, user?.id]);

  const [msg, setmsg] = useState<
    {
      message: string;
      user_id: string;
      attachment: string;
      time: Date | number;
      room: string;
      reply_ID: string;
    }[]
  >([
    {
      message: "",
      user_id: "",
      attachment: "",
      time: 0,
      room: "",
      reply_ID: "",
    },
  ]);
  useEffect(() => {
    if (showMsg.current) {
      showMsg.current.scrollIntoView({ behavior: "smooth" });
      showMsg.current.scrollTop = showMsg.current.scrollHeight;
    }
  }, [allMessage, allunreadMsgs, msg]);
  useEffect(() => {
    socket.on(
      "serverMsg",
      ({ message, room, user_id, time, reply_ID, attachment }) => {
        // Ensure `time` and `reply_ID` are provided fallback values
        setmsg((prev) => [
          ...prev,
          {
            message: message || "",
            user_id: user_id || "",
            attachment: attachment || "",
            time: time ?? new Date(), // Fallback to current time if undefined
            room: room || "",
            reply_ID: reply_ID || "", // Fallback to empty string if undefined
          },
        ]);
      }
    );
  }, []);

  return (
    <>
      {conversion ? (
        <React.Fragment key={"room"}>
          <div className="absolute top-0 left-0 p-2 border-b-2 bg-slate-800 border-white w-full flex text-white items-center gap-3">
            <ArrowLeft
              className="cursor-pointer"
              onClick={() => {
                setConversion(null);
              }}
            />
            {OpenImage && (
              <>
                <div>
                  <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    {/* Close Button */}
                    <button
                      onClick={() => {
                        setOpenImage(false);
                      }}
                      className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
                    >
                      <X />
                    </button>

                    {/* Image */}
                    <img
                      src={selectImage}
                      className="max-w-full max-h-full rounded-lg shadow-lg"
                      alt="Preview"
                    />
                  </div>
                </div>
              </>
            )}
            <Link href={`/profile/${conversion.conversionId}`}>
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
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{conversion?.name}</h1>
              {/* <p className="text-sm">last seen 2:30pm</p> */}
            </div>
          </div>
          <div
            className="grid mt-[75px] overflow-y-auto  scroll-smooth max-h-[75vh]"
            ref={showMsg}
          >
            {allKeyMsg.map((key, i) => (
              <React.Fragment key={key}>
                <center className="mt-4 ">
                  <span className="bg-white font-bold text-black p-2 rounded w-[10%] shadow-sm">
                    {key}
                  </span>
                </center>

                {allMessage.get(key)?.map((elem, j) => (
                  <React.Fragment key={key + j}>
                    {elem.user_id?.length > 0 &&
                      (elem.user_id.includes(conversion.user_id) ? (
                        <React.Fragment key={"image"}>
                          {elem.attachment == null ? (
                            <div className="flex justify-end">
                              <div className="grid justify-items-end bg-blue-200 max-w-[80%] min-w-[20%] rounded text-black p-3 m-2">
                                {elem.message}
                                <div className="text-xs text-slate-500 text-right">
                                  {moment(elem.time).format("hh:mm A")}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <div className="bg-blue-200 rounded-lg p-2 m-2 shadow-md max-w-[80%] min-w-[20%] text-black space-y-2">
                                {/* Optional attachment image */}
                                {elem.attachment && (
                                  <img
                                    onClick={() => onHandle(elem.attachment)}
                                    src={elem.attachment}
                                    alt="attachment"
                                    className="w-full max-w-xs rounded-md object-cover cursor-pointer"
                                  />
                                )}

                                {/* Message & timestamp */}
                                <div className=" rounded-lg px-4 py-2 text-right">
                                  <p className="whitespace-pre-wrap break-words">
                                    {elem.message}
                                  </p>
                                  <div className="text-xs text-slate-600 mt-1">
                                    {moment(elem.time).format("hh:mm A")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ) : (
                        <React.Fragment key={"image"}>
                          {elem.attachment == null ? (
                            <div className="flex justify-start">
                              <div className="grid text-left bg-white max-w-[80%] min-w-[20%] rounded text-black p-3 m-2">
                                {elem.message}
                                <div className="text-sm text-slate-500 text-right">
                                  {moment(elem.time).format("hh:mm A")}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-start">
                              <div className="bg-gray-200 rounded-lg p-2 m-2 shadow-md max-w-[80%] min-w-[20%]">
                                {/* Image attachment if present */}
                                {elem.attachment && (
                                  <img
                                    onClick={() => onHandle(elem.attachment)}
                                    src={elem.attachment}
                                    alt="attachment"
                                    className="w-full max-w-xs rounded-md mb-2 object-cover cursor-pointer"
                                  />
                                )}

                                {/* Message text bubble */}
                                <div className="rounded-lg px-4 py-2 text-black">
                                  <p className="whitespace-pre-wrap break-words">
                                    {elem.message}
                                  </p>
                                  <div className="text-xs text-slate-500 text-right mt-1">
                                    {moment(elem.time).format("hh:mm A")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}

            {msg.map((elem, i) => (
              <React.Fragment key={i}>
                {elem.user_id.length != 0 &&
                  (elem.user_id.includes(conversion.user_id) ? (
                    <React.Fragment key={"image"}>
                      {elem.attachment == null ? (
                        <div className="flex justify-end">
                          <div className="grid justify-items-end bg-blue-200 max-w-[80%] min-w-[20%] rounded text-black p-3 m-2">
                            {elem.message}
                            <div className="text-xs text-slate-500 text-right">
                              {moment(elem.time).format("hh:mm A")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <div className="bg-blue-200 rounded-lg p-2 m-2 shadow-md max-w-[80%] min-w-[20%] text-black space-y-2">
                            {/* Optional attachment image */}
                            {elem.attachment && (
                              <img
                                src={elem.attachment}
                                onClick={() => onHandle(elem.attachment)}
                                alt="attachment"
                                className="w-full max-w-xs rounded-md object-cover cursor-pointer"
                              />
                            )}

                            {/* Message & timestamp */}
                            <div className=" rounded-lg px-4 py-2 text-right">
                              <p className="whitespace-pre-wrap break-words">
                                {elem.message}
                              </p>
                              <div className="text-xs text-slate-600 mt-1">
                                {moment(elem.time).format("hh:mm A")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ) : (
                    <React.Fragment key={"image"}>
                      {elem.attachment == null ? (
                        <div className="flex justify-start">
                          <div className="grid text-left bg-white max-w-[80%] min-w-[20%] rounded text-black p-3 m-2">
                            {elem.message}
                            <div className="text-sm text-slate-500 text-right">
                              {moment(elem.time).format("hh:mm A")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 rounded-lg p-2 m-2 shadow-md max-w-[80%] min-w-[20%]">
                            {/* Image attachment if present */}
                            {elem.attachment && (
                              <img
                                onClick={() => onHandle(elem.attachment)}
                                src={elem.attachment}
                                alt="attachment"
                                className="w-full max-w-xs rounded-md mb-2 object-cover cursor-pointer"
                              />
                            )}

                            {/* Message text bubble */}
                            <div className="rounded-lg px-4 py-2 text-black">
                              <p className="whitespace-pre-wrap break-words">
                                {elem.message}
                              </p>
                              <div className="text-xs text-slate-500 text-right mt-1">
                                {moment(elem.time).format("hh:mm A")}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
              </React.Fragment>
            ))}

            {/*    Code on unread Msg */}
            {count > 0 && (
              <React.Fragment key={"unread-msgs"}>
                <div className="p-2 w-full flex text-black bg-[#ffffffee] items-center justify-center my-2 j gap-3">
                  <span className="text-red-600 font-semibold">
                    {count} Unread Messages
                  </span>
                </div>
                {allKeyUnMsg.map((elem) => (
                  <React.Fragment key={elem}>
                    <center className="mt-4 ">
                      <span className="bg-white font-bold text-black p-2 rounded w-[10%] shadow-sm">
                        {elem}
                      </span>
                    </center>
                    {allunreadMsgs.get(elem)?.map((e, i) => (
                      <React.Fragment key={"image"}>
                        {e.attachment == null ? (
                          <div className="flex justify-start">
                            <div className="grid text-left bg-white max-w-[80%] min-w-[20%] rounded text-black p-3 m-2">
                              {e.message}
                              <div className="text-sm text-slate-500 text-right">
                                {moment(e.time).format("hh:mm A")}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-start">
                            <div className="bg-gray-200 rounded-lg p-2 m-2 shadow-md max-w-[80%] min-w-[20%]">
                              {/* Image attachment if present */}
                              {e.attachment && (
                                <img
                                  src={e.attachment}
                                  onClick={() => onHandle(e.attachment)}
                                  alt="attachment"
                                  className="w-full max-w-xs rounded-md mb-2 object-cover cursor-pointer"
                                />
                              )}

                              {/* Message text bubble */}
                              <div className="rounded-lg px-4 py-2 text-black">
                                <p className="whitespace-pre-wrap break-words">
                                  {e.message}
                                </p>
                                <div className="text-xs text-slate-500 text-right mt-1">
                                  {moment(e.time).format("hh:mm A")}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </div>
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
            <p className="max-w-[220px] text-white">
              Welcome to <strong>YapMe</strong> — connect, chat, and enjoy
              real-time conversations!
            </p>
          </div>
        </React.Fragment>
      )}
    </>
  );
}
