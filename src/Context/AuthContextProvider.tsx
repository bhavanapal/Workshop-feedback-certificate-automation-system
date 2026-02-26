import { AuthContext } from "./AuthContext.ts";
import type { AppUser } from "./AuthContext.ts";
import { Query } from "appwrite";
import { account,tablesDB } from "../config/appwriteconfig.ts";
import {useEffect, useState, type ReactNode} from "react";


const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const AUTH_COLLECTION_ID = import.meta.env.VITE_APPWRITE_AUTH_COLLECTION_ID;

const AuthContextProvider = ({children} : {children: ReactNode}) => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

// signup
const signUp = async() => {
    throw new Error("Signup disabled.");
}

// Login
const logIn = async(email:string, password: string) =>{
    try{
        // delete existing session if any
        try{
            await account.deleteSession({sessionId: "current"});
        }catch(error:unknown){
            if(error instanceof Error){
            console.error("Unexpected logout error:", error);
            }
        }

          // create new email session
          await account.createEmailPasswordSession({email, password});

            //get current user
          const currentUser = await account.get();

       // check/fetch role from database
       const roleData = await tablesDB.listRows({
       databaseId: DATABASE_ID,
       tableId: AUTH_COLLECTION_ID,
    queries:[Query.equal("userId", currentUser.$id)],
      });

       if(!roleData.rows?.length) throw new Error("Not authorized Access denied: user not found");

       const role = roleData.rows[0].role;

       if(role !== "admin"){
        throw new Error("Access denied: not admin");
        }

        setUser({
        uid: currentUser.$id, 
        email: currentUser.email, 
        role,
        });

        return role;
    } catch(err){
        console.error("Login failed", err);
    }
  };
    
// logout
const logOut = async() => {
    try{
      await account.deleteSession({sessionId:"current"});
    } catch(error:unknown){
            if(error instanceof Error){
            console.error("Unexpected logout error:", error);
            }
        }
     setUser(null);
};

const deleteAdmin = async() => {
    throw new Error("Not allowed Delete admin disabled.");
}

// fetch current user
useEffect(() => { 
    (async() => {
        try{
            const currentUser = await account.get();
            const roleData = await tablesDB.listRows({
                databaseId: DATABASE_ID,
                tableId: AUTH_COLLECTION_ID,
                queries:[Query.equal("userId", currentUser.$id)],
        });
            if(!roleData.rows?.length){
                setUser(null);
            }else{
              setUser({
                uid: currentUser.$id, 
                email:currentUser.email,
                role:roleData.rows[0].role,
            });
            }
            } catch{
            setUser(null);
        } finally{
            setLoading(false);
        }
    })();
},[]);

return(
    <AuthContext.Provider
     value={{
        user,
        loading,
        logIn,
        logOut,
        signUp,
        deleteAdmin,
    }}
    >{children}
    </AuthContext.Provider>
);
};
   
export default AuthContextProvider;