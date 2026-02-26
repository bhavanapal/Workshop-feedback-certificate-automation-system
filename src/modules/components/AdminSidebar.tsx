import { Button } from "@/components/ui/button";
import { FileText, LayoutDashboard, LogOut, Users } from "lucide-react";

export type TabType = "dashboard" | "forms" | "submissions";

interface Props{
    activeTab: TabType;
    setActiveTab:(tab: TabType) =>  void;
    handleLogout: () => void;
}

export const AdminSidebar = ({activeTab, setActiveTab, handleLogout} : Props) => {
    return(
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold mb-8">Workshop Admin</h2>
            <nav className="flex flex-col gap-2">
                <Button
                 variant={activeTab === "dashboard" ? "secondary" : "ghost"}
                 onClick={() => setActiveTab("dashboard")}
                 className="justify-satrt gap-3 flex items-center px-3 py-2 rounded-lg font-medium hover:bg-purple-50 hover:text-gray-800">
                    <LayoutDashboard size={18} /> 
                    Dashboard
                </Button>
                
                  <Button 
                  variant={activeTab === "forms" ? "secondary" : "ghost"}
                  onClick={() => setActiveTab("forms")}
                  className="justify-start gap-3 flex items-center px-3 py-2 rounded-lg font-medium hover:bg-purple-50 hover:text-gray-800">
                    <FileText size={18}/>
                      Forms
                 </Button>

                 <Button 
                 variant={activeTab === "submissions" ? "secondary" : "ghost"}
                 onClick={() => setActiveTab("submissions")}
                 className="justify-start gap-3 flex items-center px-3 py-2 rounded-lg font-medium hover:bg-purple-50 hover:text-gray-800">
                    <Users size={18} />
                    Submissions
                  </Button>
                </nav>


               <div className="mt-auto">
                    <Button
                     size="sm"
                     onClick={handleLogout}
                     className="w-full gap-2 flex items-center px-3 py-2 rounded-lg font-medium hover:bg-purple-50 hover:text-gray-800"
                    >
                  <LogOut size={16}/>
                  LogOut
                 </Button>
               </div>
        </div>
    );
};