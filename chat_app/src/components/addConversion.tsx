"use client";
import React, { useEffect, useRef, useState } from "react";
import { User } from "../../../type";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, LoaderPinwheel, SearchIcon } from "lucide-react";
import { except, socket, uuid } from "./socket_con";
type Id = {
  id: string | undefined;
  onReload:(data:boolean)=>void
};

const AddNewFriend: React.FC<Id> = ({ id ,onReload}) => {
  
  const [users, setusers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearch, setisSearch] = useState<boolean>(false);
  const [isload, setisload] = useState(false);
  const sendMessage = (bool:boolean) => {
    onReload(bool);
  };
  const searchbox = useRef<HTMLInputElement>(null);
  console.log(searchbox.current?.value.length);
  useEffect(() => {
    // Register socket listener once
    socket.on("getUnfriendUsers", (data: User[]) => {
      sendMessage(false)
      if (Array.isArray(data)) {
        setusers(data);
        console.log(data);
        setisload(false);
        console.log(data);
      } else {
        setusers([]);
        setFilteredUsers([]);
      }
    });

    // Optional: cleanup on unmount
    return () => {
      socket.off("getUnfriendUsers");
    };
  }, []);
  function handleSearchClick() {
    setisload(true);
    setisSearch(true);
    socket.emit("request", { isSearch: true, id });

    const query = searchbox.current?.value?.toLowerCase() || "";
    let results = users.filter((elem) => {
      return elem.name.toLowerCase().includes(query);
    });
    // console.log(results)
    setFilteredUsers(results);
    setisload(false);
  }
  return (
    <>
      <div className="grid p-3 gap-3 bg-slate-700">
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-3 bg-slate-500 text-white w-full px-4 py-2 rounded-md shadow-md">
            <SearchIcon className="text-white" />
            <input
              ref={searchbox}
              onChange={handleSearchClick}
              type="text"
              className="flex-1 bg-transparent text-white placeholder-white focus:outline-none"
              placeholder="Search your friends..."
            />
          </div>
        </div>

        <center>
          {isload && (
            <LoaderPinwheel className=" text-xl animate-spin text-center text-white" />
          )}
        </center>
        <div className="m-2 ">
          <div className="text-white font-medium text-xl">
            {filteredUsers.length == 0 && (
              <>
                <center>
                  {searchbox.current?.value.length != null ? (
                    <>
                      <p>
                        Search item '{searchbox.current?.value}' cannot be
                        presented in chatbox
                      </p>
                    </>
                  ) : (
                    <>
                      <p>No search will not be happened at now : ) </p>
                    </>
                  )}
                </center>
              </>
            )}
          </div>
          {filteredUsers.map((user, index) => (
            <div
              key={index}
              
              className="flex items-center gap-3 justify-between bg-slate-800 border-b-2 border-white text-white p-3 shadow-md mb-2 hover:bg-slate-500 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name || "User Avatar"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="grid ">
                  <span className="font-semibold">{user.name}</span>
                  <span className="font-normal">{except(20, user?.bio)}</span>
                </div>
              </div>
              <button className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600" onClick={() => {
                if (!user.id.includes(id ?? "")) {
                  socket.emit("addConversation", {
                    isGroup: false,
                    icon: user?.avatar,
                    conversionId: user.id,
                    user_id: id ?? "",
                    unread_Msg: 0,
                    name: user.name,
                    room: uuidv4(),
                  });
                  setisSearch(false);
                  searchbox.current!.value = "";
                }
                sendMessage(true)
              }}>
                Add Friend
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
export default AddNewFriend;
