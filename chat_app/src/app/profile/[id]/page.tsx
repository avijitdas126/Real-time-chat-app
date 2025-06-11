"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Edit, Loader, Mail, Phone } from "lucide-react";

import Link from "next/link";
import { User } from "../../../../../type";
import { useParams } from "next/navigation";

interface GetUser {
  user: User;
}
export default function profile() {
  let {id}=useParams()
  const { isSignedIn, user, isLoaded } = useUser();
  const [User, setUser] = useState<GetUser>();
  const [Error, setError] = useState<boolean>(false);
   console.log(id)
  useEffect(() => {
    const fetchs = async () => {
      try {
        const users = await fetch(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/v1/getprofile`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          }
        );
        if (users.status == 200) {
          let res = await users.json();
          console.log(res);
          setUser(res);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        setError(true);
        console.log(error);
      }
    };
    if (user) fetchs();
  }, [user]);

  return (
    <>
      <div className="p-4 w-full flex justify-center">
        {!isLoaded || !user ? (
          <Loader className="animate-spin text-5xl mx-auto text-gray-600 mt-[45vh]" />
        ) : (
          <div className="w-full max-w-2xl space-y-6 text-center">
            {/* Avatar */}
            <img
              src={User?.user.avatar}
              alt={User?.user.name}
              className="w-28 h-28 rounded-full object-cover mx-auto shadow-md hover:scale-105 transition-transform duration-200"
            />

            {/* Name && edit */}
            <div className="flex gap-2 justify-center rounded">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {User?.user.name}{" "}
              </h2>
              
            </div>

            {/* Info Section */}
            <div className="bg-white rounded-xl shadow p-6 space-y-6 text-left">
              {/* About Me */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  About Me
                </h3>
                <blockquote className="text-gray-600 border-l-4 border-blue-500 pl-4">
                  {User?.user.bio}
                </blockquote>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800">
                  Other Contact Items
                </h3>

                {/* Email */}
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5" />
                  <p className="break-words">{User?.user.email}</p>
                </div>

                {/* Phone (Optional) */}
                {User?.user.phone_no && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5" />
                    <p>{User?.user.phone_no}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
