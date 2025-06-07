"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { except, socket, uuid } from "./socket_con";
import { SignOutButton, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  LoaderPinwheel,
  LogOut,
  Plus,
  SearchIcon,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Conversion, Message } from "../../../type";
import ConversionContext from "@/context";
import { IConversionContext } from "@/context";
import AddNewFriend from "./addConversion";

export default function Conversions() {
  const context = useContext(ConversionContext);

  if (!context) {
    throw new Error(
      "useConversionContext must be used within a ConversionProvider"
    );
  }
  interface getConversions extends Conversion {
    lastMessage: Message;
    unread_Msg: number;
  }
  const [isDelete, setisDelete] = useState<boolean>(false);
  const [seenConversion, setseenConversion] = useState<string[]>([]);
  const { conversion, setConversion } = context;
  const { isSignedIn, user, isLoaded } = useUser();
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [conver, setconver] = useState([]);
  const [isSearch, setisSearch] = useState<boolean>(false);
  const [currentId, setcurrentId] = useState("");
  const [selectedId, setselectedId] = useState<string[]>([]);
  const [reload, setreload] = useState<boolean>(false);
  const [isLocalSearch, setisLocalSearch] = useState<boolean>(false);
  const [users, setUsers] = useState<getConversions[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<getConversions[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const searchbox = useRef<HTMLInputElement>(null);
  // add conversion
  const handleEvent = () => {
    setisSearch(!isSearch);
  };


  const handleMessage = (data:boolean) => {
    if(data){
      setisSearch(false)
    }
    setreload(data);
  };
  useEffect(() => {
    socket.emit("connectUser", {
      id: user?.id || uuid,
      socket_id: socket.id!,
      room: conversion?.id || "",
    });

    socket.on("getConversion", (data) => {
      data.sort((a: Conversion, b: Conversion) => {
        const timeA = new Date(a.time || 0).getTime();
        const timeB = new Date(b.time || 0).getTime();
        return timeB - timeA;
      });
      setconver(data);
      setUsers(data);
    });
  }, [user?.id, conversion?.id, reload]);
  const handleMouseEvent = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (e.type.includes("contextmenu")) {
      setcurrentId(e.currentTarget.id);
      setisDelete(!isDelete);
      const id: string = e.currentTarget?.id;
      setselectedId((pre) => [...pre, id]);
    } else {
      setisDelete(false);
    }
  };

  const deleteConversion = () => {
    socket.emit("deleteConversation", selectedId);
    setreload(!reload);
    setisDelete(false);
    setselectedId([]);
    setcurrentId("");
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUsers([]);
      setisLocalSearch(false);
      return;
    }

    setIsLoading(true);

    const delayDebounce = setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const results = users.filter((user) =>
        user.name?.toLowerCase().includes(query)
      );
      setFilteredUsers(results);
      setIsLoading(false);
      setisLocalSearch(true);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, users]);
  console.log(filteredUsers);
  return (
    <>
      <div className="relative h-[100vh]">
        <header className="flex justify-between items-center  justify-items-center  text-white bg-slate-700 p-4">
          <div id="logo">
            <span className="text-blue-500 text-3xl font-bold">
              Yap<span className="text-white">Up</span>
            </span>
          </div>
          <div className=" flex gap-3 justify-end">
            {isDelete && <Trash2 onClick={deleteConversion} />}
            <Settings
              onClick={() => {
                setisOpen(!isOpen);
              }}
            />
          </div>

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
        {!isSearch && (
          <div className="grid p-3 gap-3 bg-slate-700">
            <div className="flex gap-2 items-center">
              {isLocalSearch && (
                <ArrowLeft
                  className="text-white text-2xl cursor-pointer"
                  onClick={() => {
                    setisLocalSearch(false);
                    setFilteredUsers([]);
                    if (searchbox.current) searchbox.current.value = "";
                  }}
                />
              )}

              <div className="flex items-center gap-3 bg-slate-400 text-white w-full px-4 py-2 rounded-md shadow-md">
                <SearchIcon className="text-white" />
                <input
                  ref={searchbox}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  type="text"
                  className="flex-1 bg-transparent text-white placeholder-white focus:outline-none"
                  placeholder="Search your Recent Conversations..."
                />
              </div>
            </div>
          </div>
        )}

        <div className="m-2">
          <div className="grid overflow-y-auto scroll-smooth max-h-[80vh]">
            {isSearch ? (
              <AddNewFriend id={user?.id} onReload={handleMessage} />
            ) : isLocalSearch ? (
              isLoading ? (
                <div className="flex justify-center py-4">
                  <LoaderPinwheel className="w-6 h-6 text-white animate-spin" />
                </div>
              ) : (
                <div className="m-2">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          console.log("User selected:", user);
                          // You can trigger context.setConversion or emit socket here if needed
                        }}
                        className="flex items-center gap-3 bg-slate-800 border-b-2 border-white text-white p-3 shadow-md mb-2 hover:bg-slate-500 cursor-pointer rounded"
                      >
                        <img
                          src={user.icon}
                          alt={user.name || "User Avatar"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-semibold">{user.name}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-white">
                      No Conversion found
                    </p>
                  )}
                </div>
              )
            ) : (
              <>
                {conver.length == 0 && (
                  <div className="flex flex-col justify-center items-center w-full h-[70vh] mt-[5vh] text-center text-white font-medium text-xl">
                    <center>
                      <p>No one added friend in your Conversation</p>
                      <button
                        onClick={handleEvent}
                        title="Add New Conversion"
                        className="flex gap-4 rounded p-2 mt-1 hover:bg-blue-600 content-center bg-blue-500 text-white font-normal"
                      >
                        <Plus /> Add New Conversion
                      </button>
                    </center>
                  </div>
                )}
                {conver.map((user: getConversions, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (!isDelete) {
                          setConversion(user);
                          setseenConversion((prev) => [
                            ...prev,
                            user?.conversionId,
                          ]);
                        }
                      }}
                      id={user.id}
                      onContextMenu={handleMouseEvent}
                      className={`flex items-center ${
                        user.id?.includes(
                          conversion?.id ?? "active_conversation"
                        )
                          ? `bg-slate-500 text-white`
                          : "bg-slate-800 text-white"
                      } gap-3 justify-between border-b-2 border-white  p-3 shadow-md mb-2 hover:bg-slate-500 hover:text-white  cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        {isDelete && (
                          <input
                            type="checkbox"
                            name="delete"
                            id={user.id}
                            defaultChecked={currentId?.includes(user.id || "")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setselectedId((pre) => [...pre, user.id ?? ""]);
                              } else {
                                setselectedId((pre) =>
                                  pre.filter((item) => item !== user.id)
                                );
                              }
                            }}
                          />
                        )}
                        <img
                          src={user.icon}
                          alt={user.name || "User Avatar"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="grid ">
                          <span className="font-medium">{user.name}</span>
                          <span className="font-normal">
                            {except(20, user.lastMessage?.message)}
                          </span>
                        </div>
                      </div>

                      {!!user.unread_Msg &&
                        !user.conversionId?.includes(
                          conversion?.conversionId || "selected conversion"
                        ) &&
                        !seenConversion.filter((e) => {
                          return (
                            e && e.includes && e.includes(user.conversionId)
                          );
                        }).length && (
                          <span className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-sm">
                            {user.unread_Msg > 99 ? "99+" : user.unread_Msg}
                          </span>
                        )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleEvent}
          title="Add New Conversion"
          className=" m-2 absolute right-0 bottom-0 flex gap-4 rounded p-2 mt-1 hover:bg-blue-600 content-center bg-blue-500 text-white font-normal"
        >
          {isSearch ? <X /> : <Plus />}
        </button>
      </div>
    </>
  );
}
