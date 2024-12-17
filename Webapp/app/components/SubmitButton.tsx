"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

interface iAppProps {
   text: string;
}

export function SubmitButton({ text }: iAppProps) {
   const { pending } = useFormStatus();
   return (
      <>
         {!pending ? (
            <Button type="submit" className="w-full">
               {text}
            </Button>
         ) : (
            <Button className="w-full" disabled>
               <Loader2 className="animate-spin" />
               Please wait
            </Button>
         )}
      </>
   );
}
