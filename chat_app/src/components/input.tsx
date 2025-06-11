"use client";
import { File, Link, Plus, SendHorizonal, X } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import {
  NEXT_PUBLIC_CLOUD_NAME,
  NEXT_PUBLIC_UPLOAD_PRESET,
  socket,
  uuid,
} from "./socket_con";
import ConversionContext from "@/context";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export default function ChatBox() {
  const context = useContext(ConversionContext);
  const [isEmoji, setisEmoji] = useState<boolean>(false);
  const [isImage, setisImage] = useState<boolean>(false);
  const imageHandler = useRef<HTMLInputElement>(null);
  const img = useRef<HTMLImageElement>(null);
  if (!context) {
    throw new Error(
      "useConversionContext must be used within a ConversionProvider"
    );
  }
  const uploadImg = async () => {
    try {
      const file = imageHandler?.current?.files?.[0];
      if (file) {
        const data = new FormData();
        data.append("file", file);

        data.append("upload_preset", NEXT_PUBLIC_UPLOAD_PRESET);
        data.append("cloud_name", NEXT_PUBLIC_CLOUD_NAME);
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
        const url = await res.json();
        return url.secure_url;
      } else {
        return null;
      }
    } catch (error) {}
  };
  const { conversion, setConversion } = context;
  console.log(conversion);
  const sendMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    let url = await uploadImg();
    const message = chatbox.current?.value;
    if (url) {
      // Emit message to server with image
      socket.emit("clientMsg", {
        message: message ?? null,
        time: new Date(),
        room: conversion!.room,
        from: conversion!.user_id,
        user_id: conversion!.user_id,
        to: conversion!.conversionId,
        is_to_readed: false,
        is_from_readed: true,
        attachment: url,
      });
    } else if (message) {
      // Emit message to server
      socket.emit("clientMsg", {
        message: message ?? null,
        time: new Date(),
        room: conversion!.room,
        from: conversion!.user_id,
        user_id: conversion!.user_id,
        to: conversion!.conversionId,
        is_to_readed: false,
        is_from_readed: true,
      });
    } else {
      return;
    }

    chatbox.current!.value = "";
    setisImage(false);
  };
  const chatbox = useRef<HTMLInputElement>(null);
  const handleImage = async () => {
    try {
      let file = imageHandler.current?.files?.[0];
      if (file && img.current) {
        img.current.src = URL.createObjectURL(file);
      } else {
        setisImage(!isImage);
        imageHandler.current!.value = "";
        return;
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="absolute bottom-0 w-full ">
        <input type="file" ref={imageHandler} onChange={handleImage} hidden />

        {isEmoji && (
          <EmojiPicker
            className="mx-4"
            onEmojiClick={(e: EmojiClickData) => {
              if (chatbox.current) {
                chatbox.current.value += e.emoji;
              }
            }}
          />
        )}
        {isImage && imageHandler.current && (
          <>
            <div className="inset-0 p-4 bg-black bg-opacity-90 z-50 flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => {
                  setisImage(false);
                }}
                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2 transition-colors duration-300"
              >
                <X />
              </button>

              {/* Image */}
              <img
                ref={img}
                src={"/blank.png"}
                width={500}
                height={500}
                className=" max-h-full rounded-lg shadow-lg"
                alt="Preview"
              />
            </div>
          </>
        )}
        <div className="flex gap-2 m-2 justify-center">
          <div className="flex gap-2 items-center border-1 border-black bg-white text-black px-2 rounded py-1 border-solid w-[90%]  ">
            {isEmoji ? (
              <X
                className="text-gray-500 hover:bg-gray-300 rounded"
                onClick={() => {
                  setisEmoji(!isEmoji);
                }}
              />
            ) : (
              <Plus
                className="text-gray-500 hover:bg-gray-300 rounded"
                onClick={() => {
                  setisEmoji(!isEmoji);
                }}
              />
            )}
            {isImage ? (
              <X
                className="text-gray-500 hover:bg-gray-300 rounded"
                onClick={() => {
                  setisImage(!isImage);
                }}
              />
            ) : (
              <File
                className="text-gray-500 hover:bg-gray-300  rounded"
                onClick={() => {
                  setisImage(!isImage);
                  if (imageHandler.current) {
                    imageHandler.current?.click();
                  }
                }}
              />
            )}
            <input
              type="text"
              ref={chatbox}
              className="w-full p-2 focus:outline-none"
              placeholder="Message"
            />
          </div>

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
