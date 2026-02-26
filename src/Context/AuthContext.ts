import { createContext , useContext } from "react";

export interface AppUser{
    uid: string;
    email:string | null;
    role: string;
}

interface AuthContextType {
    user:AppUser | null;
    loading : boolean;
    logIn : (email : string, password : string) => Promise<string>;
    signUp : (email : string, password : string, role : string) => Promise<string>;
    logOut : () => Promise<void>;
    deleteAdmin : (uid: string) => Promise<void>;
}

// createContext
export const AuthContext = createContext<AuthContextType | null>(null);

// consumer
export const useAuth = () =>{
    const contexts = useContext(AuthContext);
    if(!contexts){
        throw new Error('useAdmin must be used within a Provider')
    }
    return contexts;
}