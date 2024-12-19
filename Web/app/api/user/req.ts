"use client";
import { URLGenerator } from "../handler";

export async function LoginUser(email: string, password: string) {
   // login the user to the airtable api
   // errmsg = Error handling
   let errmsg = "";

   if (email === "" || password === "") {
      errmsg += "Email and Password cannot be empty\n";
      return errmsg;
   }

   if (!CheckEmailValid(email)) {
      errmsg += "Email is not valid\n";
      return errmsg;
   }

   try {
      const SERVER_URL = URLGenerator("Users", {
         filterby: "email",
         filter: `${email}`,
      });

      const res = await fetch(SERVER_URL, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_API_TOKEN}`,
         },
      });

      if (!res.ok) {
         throw new Error(`Server error: ${res.status} ${res.statusText}`);
      }

      const results = await res.json();
      const users = results.records;

      if (!users || users.length < 1) {
         throw new Error("No user found with the provided email");
      }

      const user = users[0];
      if (user.fields.password !== password) {
         errmsg = "Password does not match";
         return errmsg;
      }

      setCookie("ELW_SESSION_TOKEN", `${user.fields.session_key}`, 7);

      return;
   } catch (error) {
      console.error("Login error:", error);
      throw new Error(`Login failed: ${error}`);
   }
}

export async function Auth() {
   // Check if the user is authenticated
   const session_key = getCookie("ELW_SESSION_TOKEN");

   if (!session_key) {
      return null;
   }

   try {
      const SERVER_URL = URLGenerator("Users", {
         filterby: "session_key",
         filter: `${session_key}`,
      });

      const res = await fetch(SERVER_URL, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_API_TOKEN}`,
         },
      });

      const results = await res.json();

      const users = results.records;
      const user = users[0];

      console.log(user.fields.firstname);
      return user.fields.firstname;
   } catch (error) {
      console.error("Auth error:", error);
      return "error";
   }
}

export async function RegisterUser(
   firstname: string,
   lastname: string,
   email: string,
   password: string,
   secpassword: string
) {
   let errmsg = "";

   if (
      firstname === "" ||
      lastname === "" ||
      email === "" ||
      password === "" ||
      secpassword === ""
   ) {
      errmsg += "All fields are required\n";
      return errmsg;
   }

   if (!CheckEmailValid(email.toLowerCase())) {
      errmsg += "Email is not Valid\n";
      return errmsg;
   }

   if (!IsEmailAvaliable(email.toLowerCase())) {
      errmsg += "Email is already in use\n";
      return errmsg;
   }

   if (password !== secpassword) {
      errmsg += "Passwords do not match\n";
      return errmsg;
   }

   const session_key = crypto.randomUUID();
   email = email.toLowerCase();

   try {
      const res = await fetch(URLGenerator("Users"), {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_API_TOKEN}`,
         },
         body: JSON.stringify({
            records: [
               {
                  fields: {
                     email,
                     password,
                     firstname,
                     lastname,
                     session_key,
                  },
               },
            ],
         }),
      });

      if (!res.ok) {
         throw new Error(`Server error: ${res.status} ${res.statusText}`);
      } else {
         return;
      }
   } catch (error) {
      console.error("Register error:", error);
      throw new Error(`Register failed: ${error}`);
   }
}

function CheckEmailValid(email: string): boolean {
   // Server Check if email is vaild
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (emailRegex.test(email)) {
      return true;
   }
   return false;
}

async function IsEmailAvaliable(email: string) {
   // Create the serverURL for users and check if the email is already used
   const Fetch_URL = URLGenerator("Users", {
      filterby: "email",
      filter: `${email}`,
   });

   try {
      const res = await fetch(Fetch_URL, {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APP_API_TOKEN}`,
         },
      });

      if (!res.ok) {
         console.error("Result" + res);
         throw new Error("Network error");
      }

      const data = await res.json();

      if (data.length > 0) {
         return false;
      }
      return true;
   } catch (e) {
      console.error(e);
   }
}

function setCookie(name: string, value: string, days: number): void {
   const date = new Date();
   // Set the expiration date
   date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
   const expires = `expires=${date.toUTCString()}`;

   // Set the cookie on Path / for accesability
   document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/`;
}

function getCookie(name: string): string | null {
   if (typeof document === "undefined") {
      return null;
   }
   const nameEQ = name + "=";
   const ca = document.cookie.split(";");
   for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0)
         return decodeURIComponent(c.substring(nameEQ.length, c.length));
   }
   return null;
}
