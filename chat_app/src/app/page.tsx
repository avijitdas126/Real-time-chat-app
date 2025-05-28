"use client";

import Conversions from "@/components/conversion";
import ChatBox from "@/components/input";
import Room from "@/components/room";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"; // or use `next/navigation` for App Router
import { useEffect } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user && !user.publicMetadata?.formCompleted) {
      router.push("/complete-profile");
    }
  }, [isLoaded, user]);

  return (
    <div className="flex">
      <div className="hidden lg:block w-[50vw] h-[100vh] bg-slate-800">
        <Conversions />
      </div>
      <div className="lg:w-[50vw] h-[100vh] w-[100vw] bg-slate-300 relative">
        <Room />
        
      </div>
    </div>
  );
}
