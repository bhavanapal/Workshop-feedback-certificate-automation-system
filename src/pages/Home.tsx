import AdminLogin from "@/modules/auth/pages/AdminLogin"
import { GraduationCap } from "lucide-react"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/*left side */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-12 flex-col justify-between">
         <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <GraduationCap size={28} />
               Workshop Feedback System  
            </div>
               
            <h1 className="mt-20 text-4xl font-bold leading-tight">
               Create Workshops <br/> Collect Feedback <br/> Generate Certificates
            </h1>

            <p className="mt-6 text-white/80 text-lg">
              A complete platform for managing college workshops,collecting student feedbacks, and generating certificate automatically.
            </p>
         </div>

         <p className="text-sm text-white/70">
             @ 2026 Workshop Managemant System
         </p>
      </div>

      {/* Right side */}
      <div className="flex flex-1 items-center justify-center bg-muted px-6 py-12">
       <div className="w-full max-w-md space-y-6 backdrop-blur-md p-6">

        {/* mobile heading */}
        <div className="text-center lg:hidden">
          <h1 className="text-3xl font-bold text-slate-800">
            Workshop Feedback
          </h1>

          <p className="text-muted-foreground mt-2">
            Sign In to create and manage workshops
          </p>
         </div>
            
            {/* login card */}
            <div className="bg-background rounded-2xl shadow-xl p-8 border">
              <AdminLogin/>
            </div>

       </div>

      </div>
    </div>
  )
}
export default Home