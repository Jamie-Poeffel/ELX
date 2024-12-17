"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { LoginUser } from "../api/user/req";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [emailErr, setEmailErr] = useState("");
   const [passwordErr, setPasswordErr] = useState("");
   const [loading, setLoading] = useState(false);

   const login = async () => {
      setLoading(true);

      try {
         const res = await LoginUser(email.toLowerCase(), password);
         console.log(res);

         if (res.length > 0) {
            const result = res.split(" ");

            console.log(result);

            switch (result[0]) {
               case "Login": {
                  console.log("redirect to /");
                  return await redirect("/");
               }
               case "Email": {
                  setEmailErr(res);
                  break;
               }
               case "Password": {
                  setPasswordErr(res);
                  break;
               }
            }
         }
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <div className="w-screen min-h-screen flex justify-center items-center">
            <div className="w-[380px]">
               <Card>
                  <CardHeader className="p-4">
                     <CardTitle className="text-center text-2xl font-bold py-0">
                        Login
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <form
                        onSubmit={(e) => {
                           e.preventDefault();
                           login();
                        }}
                     >
                        <div className="mb-2">
                           <Label className="ml-1">Username</Label>
                           <Input
                              type="email"
                              placeholder="username"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                           />
                           <p className="text-sm text-red-500 ml-1">
                              {emailErr}
                           </p>
                        </div>
                        <div className="mb-4">
                           <Label className="ml-1">Password</Label>
                           <Input
                              type="password"
                              placeholder="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                           />
                           <p className="text-sm text-red-500 ml-1">
                              {passwordErr}
                           </p>
                        </div>
                        <div>
                           {!loading ? (
                              <Button type="submit" className="w-full">
                                 Login
                              </Button>
                           ) : (
                              <Button className="w-full" disabled>
                                 <Loader2 className="animate-spin" />
                                 Please wait
                              </Button>
                           )}
                        </div>

                        <div>
                           <div className="flex flex-row justify-between px-2 mt-3">
                              <p>No Account?</p>
                              <Link href="/login/createAccount">
                                 Create an Account
                              </Link>
                           </div>
                        </div>
                     </form>
                  </CardContent>
               </Card>
            </div>
         </div>
      </>
   );
}
