"use client";

import Conversions from "@/components/conversion";
import ChatBox from "@/components/input";
import Room from "@/components/room";
import { useUser } from "@clerk/nextjs";
import { Calculator, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation"; // or use `next/navigation` for App Router
import { useEffect } from "react";

export default function Home() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
useEffect(() => {
let isOn=async ()=>{
  let res=await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/v1`)
  if(res.status==200){
    console.log('Server is On')
  }
}
isOn()
}, [])

  useEffect(() => {
    if (isLoaded && user && !user.publicMetadata?.formCompleted) {
      router.push("/complete-profile");
    }
  }, [isLoaded, user]);

  return (
    <div className="flex">
  {/* Desktop Layout */}
  <div className="hidden md:flex w-full">
    <div className="w-[50vw] h-[100vh] bg-slate-800 border-r-2 border-white">
      <Conversions />
    </div>
    <div className="lg:w-[50vw] w-full h-[100vh] bg-slate-800 relative">
      <Room />
    </div>
  </div>

  {/* Mobile Block Message */}
  <div className="flex md:hidden w-full h-screen items-center justify-center bg-black text-white text-center p-4">
<Smartphone className='mx-auto font-bold text-2xl'size={100} />
<p className="text-lg font-semibold">
      This application is not available on mobile devices. Please use a desktop browser.
    </p>
  </div>
</div>

  );
}
