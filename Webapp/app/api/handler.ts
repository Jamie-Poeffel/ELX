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
