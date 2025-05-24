import Conversion from "@/components/conversion";
import ChatBox from "@/components/input";
import Room from "@/components/room";
import { LogOut } from "lucide-react";
import Image from "next/image";
import * as io from "socket.io-client";

export default function Home() {
 

   
  return (
  <>
  <Conversion />
  <Room />
  <ChatBox  />
  
  </>
  );
}
