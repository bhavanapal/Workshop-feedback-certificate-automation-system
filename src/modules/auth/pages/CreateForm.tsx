import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import type { WorkshopSchema } from "@/modules/student/schema/FormSchema";
import { workshopschema } from "@/modules/student/schema/FormSchema";
import { useFormDataContext } from "@/Context/FormContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FormError from "@/modules/components/FormError";
import { Card, CardContent, CardDescription, CardHeader, CardTitle  } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";


const CreateForm = () => {
    const {createForm} = useFormDataContext();
    const {register,handleSubmit,formState:{errors}, reset} = useForm<WorkshopSchema>({
        resolver:zodResolver(workshopschema),
        });
    const navigate = useNavigate();

    const onSubmit = async(data: WorkshopSchema) => {
       try{
        await createForm(data);
         alert("Workshop form created successfully!");
         reset()
       } catch (err) {
        console.error("Form creation failed:", err);
        alert("Failed to create form");
       }  
    };

    return(
     <div className='min-h-screen bg-slate-100'>

        {/* header */}
        <div className="bg-white border-b">
           <div className="max-w-5xl mx-auto flex items-center gap-4 px-4 sm:px-6 py-4">
            <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            >
             <ArrowLeft className="h-5 w-5"/>
            </Button>

            <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Create Workshop Form</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Fill in the details to generate a student feedback form</p>
            </div>

           </div>
        </div>
       
            {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <Card className="rounded-2xl shadow-md border-0">
                <CardHeader>
                    <CardTitle>Workshop Information</CardTitle>
                    <CardDescription>
                        Enter workshop details carefully.you can activate the form later.
                    </CardDescription>
                </CardHeader>

                <Separator/>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor = "collegeName">College Name</Label>
                                <Input
                                 id="collegeName"
                                 type="text"
                                 placeholder="Your College Name"
                                 {...register("collegeName")}
                                />
                             <FormError message={errors.collegeName?.message}/>
                            </div>
                             
                            <div className="flex flex-col gap-2">
                              <Label htmlFor = "workshopName">Workshop Name</Label>
                              <Input
                               id = "workshopName"
                               type = "text"
                               placeholder = "Workshop Name"
                               {...register("workshopName")}
                               />
                            <FormError message = {errors.workshopName?.message}/>
                            </div>
                            </div> 

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                 <Label htmlFor = "date">Date</Label>
                                 <Input
                                 id = "date"
                                 type="date"
                                 {...register("date")}
                                  />
                                  <FormError message = {errors.date?.message}/>
                                </div> 

                                <div className="flex flex-col gap-2">
                                <Label htmlFor = "time">Time</Label>
                                <Input
                                id = "time"
                                type = "time"
                                {...register("time")}
                                 />
                                <FormError message = {errors.time?.message}/>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                               <Label htmlFor = "instructions">Instructions</Label>
                                <Textarea
                               id = "instructions"
                               placeholder = "Provide instructions for participants..."
                               className="min-h-[120px]"
                               {...register("instructions")}
                             />
                            <FormError message = {errors.instructions?.message}/>
                            </div>

                           <div className="flex flex-col gap-2">
                            <Label htmlFor="studentEmail">Student Email</Label>
                            <Input
                              id="studentEmail"
                              type="email"
                              placeholder="Enter student email's"
                              {...register("studentEmail")}
                            />
                            <FormError message={errors.studentEmail?.message}/>
                            </div>

                            {/* button section */}
                            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                                <Button
                                type="button"
                                variant="outline"
                                className="w-full sm:w-auto font-semibold bg-gradient-to-r from-indigo-600 to-red-600 text-white hover:from-indigo-700 hover:to-red-700 transition rounded-xl"
                                onClick={() => navigate("/admin")}
                                >
                                 Cancel
                                </Button>

                                <Button type="submit"
                                className="w-full sm:w-auto font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition rounded-xl"
                                >
                                  Create Workshop
                                </Button>
                            </div>

                        </form>
                </CardContent>
            </Card>
        </div>
        </div>
        );
    }

export default CreateForm
            

           