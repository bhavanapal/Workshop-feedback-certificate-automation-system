import {Client, Account, Databases, Storage, Teams, TablesDB} from "appwrite";

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

  export const account = new Account(client);
  export const teams = new Teams(client);
  export const databases = new Databases(client);
  export const storage = new Storage(client);
  export const tablesDB = new TablesDB(client)
 

  