"use client";
import React, { useEffect, useState } from "react";
import { socket, uuid } from "./socket_con";
import moment from "moment";
import { ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";

export default function Room() {
  const { isSignedIn, user, isLoaded } = useUser()
  const [msg, setmsg] = useState<{ message: string; user_id: string,time:Date | number }[]>([
    {
      message:
        "",
      user_id: "",
      time: 0
    },
  ]);
  useEffect(() => {
    socket.on("serverMsg", ({ message, room, user_id,time }) => {
      setmsg([...msg!, { message, user_id ,time}]);
    });
  }, [socket, msg]);

  return (
    <>
    <div className="absolute top-0 left-0 p-2 bg-blue-600 w-full flex text-white items-center gap-3">
            <ArrowLeft className='cursor-pointer' />
           
            <img
              src={user?.imageUrl || "https://avatars.githubusercontent.com/u/123456789?v=4"}
              alt="Logo"
              width={50}
              height={50}
              className="rounded-full cursor-pointer"
            />
            <div>
              <h1 className="text-lg font-semibold">{user?.firstName}</h1>
              <p className="text-sm">last seen 2:30pm</p>
            </div>
          </div>
      <div className="grid mt-[75px] ">
        {msg.map((elem, i) => (
          <React.Fragment key={i}>
            {elem.user_id.length != 0 &&
              (elem.user_id.includes(uuid) ? (
                <div key={"child" + i} className="flex justify-end">
                  <div
                    className="grid justify-items-end bg-blue-200 max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                    id="own"
                  >
                    {elem.message}
                    <div className='text-xs text-slate-500'>{moment(elem.time).format("hh:mm A")} </div>
                  </div>
                  
                </div>
              ) : (
                <div key={"child" + i} className="flex justify-start">
                   <div
                    className="grid justify-items-end bg-white max-w-[80%] min-w-[20%] rounded  text-black p-3 m-2 "
                    id="own"
                  >
                    {elem.message}
                    <div className='text-sm text-slate-500'>{moment(elem.time).format("hh:mm A")} </div>
                  </div>
                  
                </div>
              
              ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
