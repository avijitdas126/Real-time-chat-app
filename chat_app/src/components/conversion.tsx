"use client";
import React, { useEffect, useState } from "react";
import { socket, uuid } from "./socket_con";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { LogOut, Settings, User } from "lucide-react";
import Search from "./search";

export default function Conversion() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [isOpen, setisOpen] = useState<boolean>(false)
  useEffect(() => {
    socket.emit("connectUser", {
      id: user?.id || uuid,
      socket_id: socket.id!,
    });
  });
  // socket.emit('connectUser',{id:'11111', socket_id: socket.id })
  return (
    <>
      <div className="">
        <header className="flex justify-between items-center  justify-items-center  text-white bg-slate-600 p-4">
          <div id="logo">
            <span className="text-blue-500 text-3xl font-bold">
              Yap<span className="text-white">Up</span>
            </span>
          
          </div>
            <Settings onClick={()=>{setisOpen(!isOpen)}} />
              {isOpen && <div className="absolute z-10 mt-2 w-44 rounded-md shadow-lg  top-7 left-[35vw] bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1 text-sm text-gray-700">
            <a
              href="#"
              className=" px-4 py-2 hover:bg-gray-100 flex gap-3"
            >
            <User />  Profile 
            </a>
            <SignOutButton>
            <button 
              className=" px-4 py-2 hover:bg-gray-100 flex gap-3"
            >
             <LogOut/> Logout 
            </button >
        </SignOutButton>
          </div>
        </div> }
             
        </header >
<Search />
      </div>
    </>
  );
}
