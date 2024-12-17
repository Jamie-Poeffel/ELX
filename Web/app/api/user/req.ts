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
      return `Login successful! Welcome ${user.fields.name}`;
   } catch (error) {
      console.error("Login error:", error);
      throw new Error(`Login failed: ${error}`);
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
