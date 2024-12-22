"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Auth } from "../api/user/req";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InstallPage() {
   const [username, setUsername] = useState("User");
   const [loading, setLoading] = useState(true);
   const [os, setOs] = useState("");

   useEffect(() => {
      async function fetchName() {
         const name = await Auth();
         if (name) {
            setUsername(name);
         }
         setLoading(false);
      }
      fetchName();

      const platform = window.navigator.platform.toLowerCase();
      if (platform.includes("win")) {
         setOs("Windows");
      } else if (platform.includes("mac")) {
         setOs("MacOS");
      } else if (platform.includes("linux")) {
         setOs("Linux");
      } else {
         setOs("an unknown operating system");
      }
   }, []);

   if (loading) {
      return (
         <div className="w-screen h-dvh flex justify-center items-center">
            <Skeleton>
               <div className="w-[380px] h-40 bg-gray-200 rounded-full" />
            </Skeleton>
         </div>
      );
   }

   return (
      <div className="w-screen min-h-dvh flex justify-center items-center p-4">
         <div className="w-[380px]">
            <Card>
               <CardHeader className="p-4">
                  <CardTitle className="text-center text-2xl font-bold py-0">
                     Welcome, {username}!
                  </CardTitle>
               </CardHeader>
               <CardContent className="text-center">
                  <p className="mb-4">You are using {os}.</p>
                  <Button className="w-full">Start Installation</Button>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
