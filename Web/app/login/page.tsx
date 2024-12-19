"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import { LoginUser } from "../api/user/req";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [emailErr, setEmailErr] = useState("");
   const [passwordErr, setPasswordErr] = useState("");
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const login = async () => {
      setLoading(true);

      try {
         const res = await LoginUser(email.toLowerCase(), password);

         if (res?.length === 0 || res === undefined) {
            // Redirect user to installation page
            router.push("/install");
         } else {
            // Handle login errors
            setEmailErr(res!);
            setPasswordErr(res!);
         }
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="w-screen min-h-dvh flex justify-center items-center p-4">
         <div className="w-[380px]">
            <Card>
               <CardHeader className="p-4">
                  <CardTitle className="text-center text-2xl font-bold py-0">
                     Login
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div>
                     <Label htmlFor="email" className="mb-1 ml-1">
                        Email
                     </Label>
                     <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="mb-2"
                     />
                     {emailErr && (
                        <p className="text-red-500 text-sm ml-1">{emailErr}</p>
                     )}
                  </div>
                  <div>
                     <Label htmlFor="password" className="mb-1 ml-1">
                        Password
                     </Label>
                     <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="mb-2"
                     />
                     {passwordErr && (
                        <p className="text-red-500 text-sm ml-1">
                           {passwordErr}
                        </p>
                     )}
                  </div>
                  <div className="mt-2 ml-1">
                     <Link href="/login/forgot-password">
                        <p>Forgot password?</p>
                     </Link>
                  </div>
                  <div>
                     <Button
                        className="w-full mt-2"
                        onClick={login}
                        disabled={loading}
                     >
                        {loading ? (
                           <p className="flex justify-center items-center gap-2">
                              <Loader2 className="animate-spin" /> Please
                              Wait...
                           </p>
                        ) : (
                           <p>Login</p>
                        )}
                     </Button>
                  </div>
                  <div className="flex justify-between mt-2 ml-1 mr-1 items-center">
                     <p>Have no Account?</p>
                     <Link href="/login/register">
                        <p className="text-center">Register</p>
                     </Link>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
}
