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
   const key = crypto.pbkdf2Sync(
      `${process.env.NEXT_PUBLIC_APP_ENCRYPTION_KEY}`,
      "salt",
      100000,
      32,
      "sha256"
   );
   const iv = crypto.randomBytes(16);

   const cipher = crypto.createCipheriv(algorithm, key, iv);
   let encrypted = cipher.update(data, "utf8", "hex");
   encrypted += cipher.final("hex");

   return `${iv.toString("hex")}:${encrypted}`;
};

export const CompareEncrypted = (data: string, encrypted: string): boolean => {
   const [ivHex, encryptedData] = encrypted.split(":");
   const algorithm = "aes-256-cbc";
   const key = crypto.pbkdf2Sync(
      `${process.env.NEXT_PUBLIC_APP_ENCRYPTION_KEY}`,
      "salt",
      100000,
      32,
      "sha256"
   );
   const iv = Buffer.from(ivHex, "hex");

   const cipher = crypto.createCipheriv(algorithm, key, iv);
   let encryptedInput = cipher.update(data, "utf8", "hex");
   encryptedInput += cipher.final("hex");

   return encryptedInput === encryptedData;
};
