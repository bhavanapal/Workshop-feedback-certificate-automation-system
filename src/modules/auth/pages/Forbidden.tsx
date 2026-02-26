import { Button } from "@/components/ui/button";
import {Link} from "react-router-dom";

const Forbidden = () =>{
    return (
        <div>
            <h1>403 - Forbidden</h1>
            <p>You do not have permission  to access this page.</p>

            <Link to = "/">
            <Button className="mt-4">Go Home</Button>
            </Link>
        </div>
    )
}

export default Forbidden;