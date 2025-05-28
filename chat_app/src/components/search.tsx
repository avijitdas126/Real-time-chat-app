"use client";
import React, { useEffect, useRef, useState } from "react";
import { User } from "../../../type";
import { v4 as uuidv4 } from 'uuid'
import { ArrowLeft, LoaderPinwheel, SearchIcon } from "lucide-react";
import { except, socket, uuid } from "./socket_con";
type Id = {
  id: string | undefined;
};

const Search: React.FC<Id> = ({ id }) => {

  const [users, setusers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isSearch, setisSearch] = useState<boolean>(false);
  const [isload, setisload] = useState(false);
  const searchbox = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Register socket listener once
    socket.on("getAllUsers", (data: User[]) => {
      if (Array.isArray(data)) {
        setusers(data);
        setisload(false);
      } else {
        setusers([]);
        setFilteredUsers([]);
      }
    });

    // Optional: cleanup on unmount
    return () => {
      socket.off("getAllUsers");
    };
  }, []);
  function handleSearchClick() {
    setisload(true);
    setisSearch(true);
    socket.emit("request", { isSearch: true });

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
          {isSearch && (
            <ArrowLeft
              className="text-white text-2xl cursor-pointer"
              onClick={() => {
                setisSearch(false);
                searchbox.current!.value = "";
              }}
            />
          )}

          <div className="flex items-center gap-3 bg-slate-400 text-white w-full px-4 py-2 rounded-md shadow-md">
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

        {isSearch && (
          <React.Fragment key={`search-${isSearch}`}>
            <center>
              {isload && (
                <LoaderPinwheel className=" text-xl animate-spin text-center text-white" />
              )}
            </center>
            <div className="m-2">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  onClick={()=>{
                    socket.emit('addConversation',{isGroup:false, icon:user?.avatar, conversionId:user.id, user_id:id ?? '', unread_Msg:0,name:user.name,room:uuidv4()})
                    setisSearch(false)
                   searchbox.current!.value='';
                  }}
                  className="flex items-center gap-3 bg-slate-400 text-white p-3 rounded-md shadow-md mb-2 hover:bg-slate-500 cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name || "User Avatar"}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="grid ">
                    <span className="font-semibold">{user.name}</span>
                    <span className="font-normal">{except(20,user?.bio)}</span>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
}
export default Search;