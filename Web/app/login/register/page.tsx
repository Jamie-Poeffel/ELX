"use client";
import { RegisterUser } from "@/app/api/user/req";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
   const [loading, setLoading] = useState(false);
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [secpassword, setSecpassword] = useState("");
   const [firstname, setFirstname] = useState("");
   const [lastname, setLastname] = useState("");
   const [emailErr, setEmailErr] = useState("");
   const [passwordErr, setPasswordErr] = useState("");
   const [secpasswordErr, setSecpasswordErr] = useState("");
   const router = useRouter();

   const register = async () => {
      setLoading(true);

      try {
         // Register User
         const res = await RegisterUser(
            firstname,
            lastname,
            email,
            password,
            secpassword
         );

         if (res?.length === 0 || res === undefined) {
            // Redirect user to installation page
            router.push("/login");
         } else {
            // Handle login errors
            setEmailErr(res!);
            setPasswordErr(res!);
            setSecpasswordErr(res!);
         }
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <>
         <div className="min-h-dvh flex flex-col justify-center gap-4">
            <Link href="/login" className="ml-3">
               <p className="flex items-center gap-2 cursor-pointer">
                  <ChevronLeft /> Back
               </p>
            </Link>
            <div className="w-screen min-h-full flex justify-center items-center p-4">
               <div className="w-[380px]">
                  <Card>
                     <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold mb-1">
                           <h1>Register</h1>
                        </CardTitle>
                        <CardDescription>
                           <p>Create an account to get started.</p>
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <div>
                           <form>
                              <div className="flex flex-row gap-4 mb-2">
                                 <div className="flex-1">
                                    <Label className="ml-1">First Name</Label>
                                    <Input
                                       id="firstname"
                                       type="text"
                                       onChange={(e) =>
                                          setFirstname(e.target.value)
                                       }
                                       placeholder="First Name"
                                       value={firstname}
                                    />
                                 </div>
                                 <div className="flex-1">
                                    <Label className="ml-1">Last Name</Label>
                                    <Input
                                       value={lastname}
                                       id="lastname"
                                       type="text"
                                       onChange={(e) =>
                                          setLastname(e.target.value)
                                       }
                                       placeholder="Last Name"
                                    />
                                 </div>
                              </div>
                              <div className="mb-2">
                                 <Label className="ml-1">Email</Label>
                                 <Input
                                    value={email}
                                    type="email"
                                    id="email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                 />
                                 {emailErr && (
                                    <p className="text-red-500 text-sm ml-1">
                                       {emailErr}
                                    </p>
                                 )}
                              </div>
                              <div className="mb-2">
                                 <Label className="ml-1">Password</Label>
                                 <Input
                                    value={password}
                                    type="password"
                                    id="password"
                                    onChange={(e) =>
                                       setPassword(e.target.value)
                                    }
                                    placeholder="Password"
                                 />
                                 {passwordErr && (
                                    <p className="text-red-500 text-sm ml-1">
                                       {passwordErr}
                                    </p>
                                 )}
                              </div>
                              <div className="mb-2">
                                 <Label className="ml-1">
                                    Confirm Password
                                 </Label>
                                 <Input
                                    value={secpassword}
                                    type="password"
                                    id="secpassword"
                                    onChange={(e) =>
                                       setSecpassword(e.target.value)
                                    }
                                    placeholder="Confirm Password"
                                 />
                                 {secpasswordErr && (
                                    <p className="text-red-500 text-sm ml-1">
                                       {secpasswordErr}
                                    </p>
                                 )}
                              </div>
                              <div>
                                 <Button
                                    className="w-full mt-2"
                                    onClick={register}
                                    disabled={loading}
                                 >
                                    {loading ? (
                                       <p className="flex justify-center items-center gap-2">
                                          <Loader2 className="animate-spin" />{" "}
                                          Please Wait...
                                       </p>
                                    ) : (
                                       <p>Register</p>
                                    )}
                                 </Button>
                              </div>
                           </form>
                        </div>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </>
   );
}
