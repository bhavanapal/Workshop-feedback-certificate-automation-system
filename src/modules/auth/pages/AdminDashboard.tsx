import {useEffect, useState} from "react";
import { useFormDataContext } from "@/Context/FormContext";
import { Button } from "@/components/ui/button";
import {Link, useNavigate} from "react-router-dom";
import { Card, CardContent} from '@/components/ui/card.tsx';
import { useAuth } from "@/Context/AuthContext";
import { toast } from "sonner";
import { Copy,Menu, Search} from "lucide-react"; 
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {AdminSidebar, type TabType } from "@/modules/components/AdminSidebar";
import { DashboardSection } from "@/modules/components/DashboardSection";
import { SubmissionsSection } from "@/modules/components/SubmissionsSection";

export const AdminDashboard = () =>{
const {formData, fetchForms, toggleStatus, totalSubmissions} = useFormDataContext();
const [search, setSearch] = useState("");
const [activeTab, setActiveTab] = useState<TabType>("dashboard");
const {logOut} = useAuth();
const navigate = useNavigate();

useEffect(() => {
    fetchForms();
},[fetchForms]);

const handleLogout = async() => {
    await logOut();
    navigate("/");
}

const filteredForms = (formData || []).filter((form) => {
    const query = search.trim().toLowerCase()

    if(!query) return true

    return(
        form?.workshopName?.toLowerCase().includes(query) || 
        form?.collegeName?.toLowerCase().includes(query)
    )
}
)

return(
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100  flex">
        <aside className="hidden md:flex md:w-64 bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-r flex-col min-h-screen p-6 shadow-sm">
            <AdminSidebar
             activeTab={activeTab}
             setActiveTab={setActiveTab}
             handleLogout={handleLogout}
            />
        </aside>

        {/* main content */}
    <div className="flex-1 flex flex-col">

          {/* topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                      <Menu size={20} />
                    </Button>
                  </SheetTrigger>

                <SheetContent side="left" className="w-64 p-6  bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-r">
                    <SheetTitle className="sr-only">
                        Menu
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                         Navigation links for Dashboard
                    </SheetDescription> 
                    <AdminSidebar
                     activeTab={activeTab}
                     setActiveTab={setActiveTab}
                     handleLogout={handleLogout}
                    />
                </SheetContent>
                </Sheet>
               <h1 className="text-lg font-semibold">Admin Dashboard</h1>
                <span className="hidden sm:block text-sm text-muted-foreground">
                Manage your workshops
                </span>
            </div>
        </header>

        {/* {/* content area main */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate/70 backdrop-blur-lg rounded-tl-3xl"> 
            {/* stats cards */}
            {activeTab === "dashboard" && (
                <DashboardSection 
                 totalForms={formData.length}
                 activeForms={formData.filter((f) => f.status).length
                 }
                 totalSubmissions={totalSubmissions}
                />
            )}

            {activeTab === "submissions" && (
                <SubmissionsSection 
                 totalSubmissions={totalSubmissions}
                />
            )}

                {/* filter & search */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
                    <div className="relative w-full sm:max-w-sm">
                        <Search size={16} 
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          placeholder="Search workshops..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-9"
                        />
                    </div>
                   
                    <Link to="/admin/forms/create">
                     <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition rounded-xl w-full">
                        Create New Form
                     </Button>
                    </Link>
                </div>
                
               {/* mobile-friendly workshop list */}

               <div className="grid grid-cols-1 gap-4 md:hidden mt-6">
                 {filteredForms.map((form) => {
                    const formLink = form.status && form.uniqueLink ? `${window.location.origin}/form/${form.uniqueLink}` : null
                    return(
                        <Card key={form.id} className="shadow-sm hover:shadow-md transition">
                            <CardContent className="space-y-2">
                                <h3 className="text-lg font-semibold">{form.workshopName}</h3>
                                <p className="text-sm text-muted-foreground">College:{form.collegeName}</p>
                                <p className="text-sm text-muted-foreground">Date:{form.date}</p>
                                <p className="text-sm"> Status:{""} {form.status ? (
                                    <Badge className="bg-green-100 text-green-700">Active</Badge>
                                ) :(
                                    <Badge variant="destructive" className="bg-red-100 text-red-700">Inactive</Badge>
                                )}
                                </p>

                                {formLink ? (
                                    <div className="flex items-center gap-2">
                                    <a 
                                    href={formLink}
                                    target="_blank"
                                    className="text-primary text-sm underline"
                                    >
                                    Open
                                    </a>

                                    <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => {
                                    navigator.clipboard.writeText(formLink)
                                    toast.success("Link copied!")
                                     }}
                                    >
                                    <Copy size={16}/>
                                    </Button>
                                    </div>
                                    ):(
                                    <span className="text-muted-foreground text-sm">
                                                No link
                                    </span>
                                    )}
                                     <div className="flex items-center justify-between mt-4 pt-3 border-t">
                                        <span className="text-sm font-medium">Form Status</span>

                                                <Button
                                                  size="sm"
                                                  variant={form.status ? "default" : "outline"}
                                                  className={
                                                  form.status
                                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                                                }
                                                 onClick={async () => {
                                                 await toggleStatus(form.id!, !form.status)
                                                  toast.success(
                                                `Form turned ${form.status ? "OFF" : "ON"}`
                                                    )
                                                  }}
                                                   >
                                               {form.status ? "Active" : "Inactive"}
                                            </Button>
                                        </div>
                            </CardContent>
                             </Card>
                              )
                              })}
                            </div>

                {/* workshop table Desktop table*/}
                <div className="hidden md:block mt-6">
                <Card>
                    <CardContent className="p-0">
                        <Table className="min-w-[750px]">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Workshop</TableHead>
                                <TableHead>College</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Link</TableHead>
                                <TableHead className="text-right">Toggle</TableHead>
                              </TableRow>
                            </TableHeader>

                            <TableBody>
                             {filteredForms .map((form) => {
                                 const formLink = form.status && form.uniqueLink ? `${window.location.origin}/form/${form.uniqueLink}` : null

                                 return(
                                    <TableRow key={form.id}>
                                        <TableCell className="font-medium">
                                            {form.workshopName}
                                        </TableCell>

                                        <TableCell>{form.collegeName}</TableCell>
                                        <TableCell>{form.date}</TableCell>

                                        <TableCell>{form.status ? (
                                         <Badge className="bg-green-100 text-green-700">
                                            Active
                                        </Badge>
                                        ):( 
                                            <Badge variant = "destructive" className="bg-red-100 text-red-700">
                                                Inactive
                                            </Badge>
                                        )}
                                        </TableCell>

                                        <TableCell>
                                             {formLink ? (
                                                <div className="flex items-center gap-2">
                                                    <a 
                                                    href={formLink}
                                                    target="_blank"
                                                    className="text-primary text-sm underline"
                                                    >
                                                        Open
                                                    </a>

                                                    <Button
                                                      size="icon"
                                                      variant="ghost"
                                                      onClick={() => {
                                                        navigator.clipboard.writeText(formLink)
                                                        toast.success("Link copied!")
                                                      }}
                                                    >
                                                        <Copy size={16}/>
                                                    </Button>
                                                </div>
                                             ):(
                                                <span className="text-muted-foreground text-sm">
                                                    -
                                                </span>
                                             )}
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Button
                                            size="sm"
                                            variant={form.status ? "destructive" : "default"}
                                             className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:text-black"
                                            onClick={async () => {
                                                await toggleStatus(form.id!, !form.status)
                                                toast.success(
                                                    `Form turned ${form.status ? "OFF" : "ON"}`
                                                )
                                            }}
                                            >
                                              {form.status ? "Turn off" : "Turn On"}
                                            </Button>
                                       </TableCell>
                                       </TableRow>
                                 )
                             })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                </div> 
        </main>
    </div>
   </div>
    )
    };
