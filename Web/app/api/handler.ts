import * as crypto from "crypto";

export const URLGenerator = (
   tablename: string,
   filters?: { filterby: string; filter: string }
): string => {
   if (filters?.filter === null) {
      return `https://api.airtable.com/v0/${process.env.NEXT_PUBLIC_APP_URL}/${tablename}`;
   } else {
      return `https://api.airtable.com/v0/${
         process.env.NEXT_PUBLIC_APP_URL
      }/${tablename}?filterByFormula=${encodeURIComponent(
         `{${filters?.filterby}} = '${filters?.filter}'`
      )}`;
   }
};

export const Encript = (data: string): string => {
   const algorithm = "aes-256-cbc";
   const key = crypto.randomBytes(32);
   const iv = crypto.randomBytes(16);

   const cipher = crypto.createCipheriv(algorithm, key, iv);
   let encrypted = cipher.update(data, "utf8", "hex");
   encrypted += cipher.final("hex");

   return `${iv.toString("hex")}:${encrypted}`;
};
