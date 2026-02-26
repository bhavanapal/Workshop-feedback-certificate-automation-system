import { Navigate} from 'react-router-dom';
import { useAuth } from "@/Context/AuthContext.ts";

interface ProtectedRouteProps{
    children: React.ReactNode;
    role?: "admin" | "student" | "user";
}

const ProtectedRoute = ({children, role} : ProtectedRouteProps) => {
    const {user, loading} = useAuth();

    if(loading){
    return <div>Loading...</div>
    }

     if(user && window.location.pathname === "/"){
        return <Navigate to="/admin" />;
    }

    // if no user $ trying to access protected pages like /admin, redirect to /admin or the relevent dashboard
    if(!user) {
        return<Navigate to="/"/>;
    }
    
    if(role && user.role !== role){
        return<Navigate to="/unauthorized"/>;
    }
    return<>{children}</>;
}
export default ProtectedRoute;