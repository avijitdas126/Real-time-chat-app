"use client";
import React, { useContext, useEffect, useState } from "react";
import { socket, uuid } from "./socket_con";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, Settings, User } from "lucide-react";
import Search from "./search";
import { Conversion } from "../../../type";
import ConversionContext from "@/context";
import { IConversionContext } from "@/context";

export default function Conversions() {
  const context = useContext(ConversionContext);

if (!context) {
  throw new Error("useConversionContext must be used within a ConversionProvider");
}
const { conversion, setConversion } = context;
  const { isSignedIn, user, isLoaded } = useUser();
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [conver, setconver] = useState([])
  useEffect(() => {
    socket.emit("connectUser", {
      id: user?.id || uuid,
      socket_id: socket.id!,
      room:conversion?.id || ''
    });
    // console.log(conversion?.id)
    socket.on('getConversion',(data)=>{
      setconver(data)
    })
  },[user?.id,conversion?.id]);
const [currentConversationId, setcurrentConversationId] = useState('')
  // socket.emit('connectUser',{id:'11111', socket_id: socket.id })
  return (
    <>
      <div className="">
        <header className="flex justify-between items-center  justify-items-center  text-white bg-slate-700 p-4">
          <div id="logo">
            <span className="text-blue-500 text-3xl font-bold">
              Yap<span className="text-white">Up</span>
            </span>
          </div>
          <Settings
            onClick={() => {
              setisOpen(!isOpen);
            }}
          />
          {isOpen && (
            <div className="absolute z-10 mt-2 w-44 rounded-md shadow-lg  top-7 left-[35vw] bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1 text-sm text-gray-700">
                <a href="#" className=" px-4 py-2 hover:bg-gray-100 flex gap-3">
                  <User /> Profile
                </a>
                <SignOutButton>
                  <button className=" px-4 py-2 hover:bg-gray-100 flex gap-3">
                    <LogOut /> Logout
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}
        </header>
        <Search id={user?.id} />

        <div className="m-2">
          <div className="grid overflow-y-auto scroll-smooth max-h-[80vh]">
          {conver.map((user:Conversion,index)=>{
            return (
               <div
                  key={index}
                  onClick={()=>{
                    setConversion(user)
                  }}
                  id={user.id}
                  className={`flex items-center ${user.id?.includes(conversion?.id??'active_conversation')? `bg-slate-500 text-white` : 'bg-slate-800 text-white'} gap-3  border-b-2 border-white  p-3 shadow-md mb-2 hover:bg-slate-500 hover:text-white  cursor-pointer`}
                >
                  <img
                    src={user.icon}
                    alt={user.name || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="grid ">
                    <span className="font-medium">{user.name}</span>
                    <span className="font-normal"></span>
                  </div>
                </div>
            )
          })}
        </div>
        </div>
      </div>
    </>
  );
}
