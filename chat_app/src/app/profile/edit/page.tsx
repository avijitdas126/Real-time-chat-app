"use client";
import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Edit, Loader, Mail, Phone } from "lucide-react";
import { User } from "../../../../../type";
import { NEXT_PUBLIC_CLOUD_NAME, NEXT_PUBLIC_UPLOAD_PRESET } from "@/components/socket_con";
interface GetUser {
  user: User;
}
export default function profile() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [User, setUser] = useState<GetUser>();
  const [Error, setError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bioInputRef = useRef<HTMLTextAreaElement>(null);
  const profileInputRef = useRef<HTMLImageElement>(null);
  const phInputRef = useRef<HTMLInputElement>(null);
  const [load, setload] = useState<boolean>(false);
  const router = useRouter();
  const handleImageClick = () => {
    if (fileInputRef) {
      fileInputRef.current?.click();
    }
  };
  const handlefile = () => {
    console.log(fileInputRef.current?.files?.[0] ?? "");
    if (profileInputRef.current && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      profileInputRef.current.src = URL.createObjectURL(file);
    }
  };
  useEffect(() => {
    const fetchs = async () => {
      try {
        const users = await fetch(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/v1/getprofile`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: user?.id }),
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
  const handleSubmit = async () => {
    try {
      setload(true);
      console.log("Starting submit...");

      let url = await uploadImg();
      console.log("Image uploaded URL:", url);

      const bio = bioInputRef.current?.value ?? User?.user.bio;
      const phone = phInputRef.current?.value ?? User?.user.phone_no;
      const id = user?.id;

      console.log("Payload:", { id, bio, avatar: url, phone_no: phone });

      if ((bio || phone || url) && id) {
        const users = await fetch(
          `${process.env.NEXT_PUBLIC_SOCKET_URL}/v1/updateprofile`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, bio, avatar: url, phone_no: phone }),
          }
        );

        console.log("Backend response status:", users.status);
        const res = await users.json();
        router.push("/profile");
      } else {
        console.warn("Some required data is missing");
      }
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setload(false);
    }
  };

  const uploadImg = async () => {
    try {
      const file = fileInputRef?.current?.files?.[0];
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
        return User?.user.avatar;
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="p-4 w-full flex justify-center">
        {!isLoaded || !user ? (
          <Loader className="animate-spin text-5xl mx-auto text-gray-600 mt-[45vh]" />
        ) : (
          <div className="w-full max-w-2xl space-y-6 text-center px-4">
            {/* Avatar Upload */}

            <input
              type="file"
              ref={fileInputRef}
              hidden
              onChange={handlefile}
            />
            <div className="flex justify-center">
              <img
                ref={profileInputRef}
                onClick={handleImageClick}
                src={User?.user.avatar}
                alt={User?.user.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full cursor-pointer object-cover shadow-md hover:scale-105 transition-transform duration-200"
              />
            </div>

            {/* Name */}
            <div className="text-left space-y-2">
              <label
                htmlFor="Name"
                className="block text-sm font-semibold text-gray-700"
              >
                Name
              </label>
              <input
                id="Name"
                defaultValue={User?.user.name || ""}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              />
            </div>

            {/* Bio */}
            <div className="text-left space-y-2">
              <label
                htmlFor="Bio"
                className="block text-sm font-semibold text-gray-700"
              >
                Bio for yourself
              </label>
              <textarea
                ref={bioInputRef}
                id="Bio"
                defaultValue={User?.user.bio || ""}
                placeholder="Enter your Bio"
                className="w-full min-h-[100px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 resize-none"
              ></textarea>
            </div>

            {/* Phone No */}
            <div className="text-left space-y-2">
              <label
                htmlFor="Phone"
                className="block text-sm font-semibold text-gray-700"
              >
                Phone:
              </label>
              <input
                id="Phone"
                ref={phInputRef}
                defaultValue={User?.user.phone_no || ""}
                placeholder="Enter your phone no.."
                minLength={10}
                maxLength={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700"
              />
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 mt-4  text-white font-semibold px-6 py-2 cursor-pointer rounded-xl shadow-md hover:bg-blue-700 transition duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              {load ? (
                <>
                  <div className="flex gap-2">
                    <Loader className="animate-spin text-white" /> Loading
                  </div>
                </>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
