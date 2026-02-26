import { createBrowserRouter } from "react-router-dom";
import { AdminDashboard } from "./modules/auth/pages/AdminDashboard";
import CreateForm from "./modules/auth/pages/CreateForm";
import FeedbackForm  from "./modules/student/pages/FeedbackForm";
import ProtectedRoute from "./modules/components/ProtectedRoute";
import Home from "./pages/Home";
import Forbidden from "./modules/auth/pages/Forbidden";

export const router = createBrowserRouter([
    {
        path: "/", 
        element: <Home/>
    },
     {
        path: "/unauthorized",
        element: <Forbidden/>
    },
    {
        path:"/admin",
        element:(
            <ProtectedRoute role = "admin">
                <AdminDashboard />
            </ProtectedRoute>
        )
    },
    {
        path:"/admin/forms/create",
        element:(
            <ProtectedRoute role = "admin">
                <CreateForm/>
            </ProtectedRoute>
        )
    },
    {
        path:"/form/:linkId",
        element:<FeedbackForm />
    },
])