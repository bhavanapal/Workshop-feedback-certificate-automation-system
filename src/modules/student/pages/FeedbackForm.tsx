import {useForm, useWatch} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {tablesDB} from "@/config/appwriteconfig.ts";
import { Query ,ID} from "appwrite";
import {useParams} from "react-router-dom"
import { studentschema } from "../schema/StudentSchema.ts";
import type { StudentSchema } from "../schema/StudentSchema.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import { useEffect , useState,} from "react"; 
import { Textarea } from "@/components/ui/textarea.tsx";
import {type WorkshopSchema } from "../schema/FormSchema.ts";
import FormError from "@/modules/components/FormError.tsx";
import { uploadCertificate } from "@/utils/CertificateStore.ts";
import { sendCertificateEmail } from "@/services/EmailCertificateService.ts";
import { generateCertificate } from "@/services/generateCertificate.ts";
import { sendOtpForVerification } from "@/services/EmailVerificationService.ts";
import { saveCertificateMetadata } from "@/services/SaveCertificateMetadata.ts";
import { Separator } from "@/components/ui/separator.tsx";

// appwrite imports
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const WORKSHOPS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_WORKSHOPS_COLLECTION;
const FEEDBACK_COLLECTION_ID = import.meta.env.VITE_APPWRITE_FEEDBACK_COLLECTION;
const OTP_TABLE_ID = import.meta.env.VITE_APPWRITE_EMAILOTP_COLLECTION;

const FeedbackForm = () => {
    const {linkId} = useParams();
    const [workshop, setWorkshop] = useState<WorkshopSchema | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [emailVerified, setEmailVerified] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState<string>('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const {register, handleSubmit,control,reset,formState:{errors, isSubmitting}} = useForm<StudentSchema>({
        resolver: zodResolver(studentschema),
    });
    const email = useWatch({control, name:"email"});

    // load workshop by linkId or fetch workshop
    useEffect(() => {
            if(!linkId) return;

          const fetchWorkshop = async() => {
            try{
                console.log("fetching workshop from URL:", linkId);
                const res = await tablesDB.listRows({
                    databaseId: DATABASE_ID,
                    tableId:WORKSHOPS_COLLECTION_ID,
                    queries:[Query.equal("uniqueLink", linkId)],
                });
                console.log("workshop query response:", res);
                if(!res.rows.length){
                    setWorkshop(null);
                    setLoading(false);
                    return;
                }

                setWorkshop(res.rows[0] as unknown as WorkshopSchema);
                setLoading(false);

            }catch (error) {
                console.error("Error fetching workshop:", error);
                setWorkshop(null);
                setLoading(false);
            }
        };
          fetchWorkshop();
            },[linkId]); 

            // check duplicate Email
    const checkDupliacteEmail = async(email: string) => {
        if(!linkId) return false;

        const res = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: FEEDBACK_COLLECTION_ID,
            queries:[
                Query.equal("email", email),
                Query.equal("uniqueLink", linkId),
            ],
        });
        return res.rows.length > 0;
    };
            
// generate $ send OTP
const generateAndSendOtp = async (email: string, workshopName: string) => {

    if(!email || !workshop || !linkId) return;

    setOtpLoading(true);

    const duplicate = await checkDupliacteEmail(email);
    if(duplicate){
        alert("This email already submitted feedback.");
        return;
    }

        const generatedOtp = Math.floor(100000 + Math.random()*900000).toString();
        try{

            // delete old otps
            const existing = await tablesDB.listRows({
                databaseId: DATABASE_ID,
                tableId: OTP_TABLE_ID,
                queries: [Query.equal("email", email)],
            });
   
            for(const row of existing.rows){
                await tablesDB.deleteRow({
                    databaseId: DATABASE_ID,
                    tableId: OTP_TABLE_ID,
                    rowId: row.$id,
                });
            }

            // save $ create otp in appwrite table with email as rowId
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: OTP_TABLE_ID,
                rowId:ID.unique(),
                data:{
                    email,
                    otp:generatedOtp,
                    expiresAt: Date.now() + 10*60*1000,
                },
            });
        await sendOtpForVerification(email, workshopName, generatedOtp);
        setOtpSent(true);
        alert('OTP sent to your email!');
        } catch(error) {
            console.error("Error generating OTP:", error);
        } finally{
            setOtpLoading(false);
        }
    };

// verify OTP
     const verifyOTP = async () => {
        if(!email || !enteredOtp) return;

      try{
        const res = await tablesDB.listRows({ 
            databaseId: DATABASE_ID,
            tableId: OTP_TABLE_ID,
            queries: [Query.equal("email", email)],
        });

        if(!res.rows.length) {
            alert("OTP not found or expired.");
            return;
        }

        const otpRow = res.rows[0];
        const {otp: storedOtp, expiresAt} = otpRow;

         if(Date.now() > expiresAt){
            await tablesDB.deleteRow({
                databaseId: DATABASE_ID,
                tableId: OTP_TABLE_ID,
                rowId: otpRow.$id,
            });
            alert("OTP expired");
            return;
         }

         if(enteredOtp.trim() === String(storedOtp).trim()) {
            await tablesDB.deleteRow({
                databaseId: DATABASE_ID,
                tableId: OTP_TABLE_ID,
                rowId: otpRow.$id,
            });
            setEmailVerified(true);
            alert("Email verified successfully!");
         } else{
            alert("Invalid OTP.Please try again.");
         }
        } catch(error){
         alert("OTP not found or expired");
         console.error(error);
      }
    };

    const onSubmit = async(data: StudentSchema) => {
        console.log("Submitting form data:", data);

         if(!emailVerified){
             alert("Please verify phone and email before submitting.");
             return;
            } 
            if (!workshop) {
                alert("Workshop data is not available.");
                return;
            }

            if(!linkId) {
                alert("Invalid workshop link.");
                return;
            }

            try{
                   const duplicate = await checkDupliacteEmail(data.email);
                   if(duplicate) {
                    alert("This email already submitted feedback.");
                    return;
                   }

                
        //  generate certificate PDF
        const pdfBytes = await generateCertificate({
        studentName: data.studentName,
        course: data.course,
        date: workshop.date,
        collegeName: workshop.collegeName,
        });

     //  upload certificate to firebase storage
        const fileName = `${data.studentName}-${data.course}.pdf`;
        const certificateUrl = await uploadCertificate(pdfBytes, fileName);


    //save feedback data to firebase
    await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: FEEDBACK_COLLECTION_ID,
        rowId: ID.unique(),
        data:{
            ...data,
            uniqueLink:linkId,
            submittedAt: new Date().toISOString(),
            certificateUrl,
        },
    });
        await saveCertificateMetadata({
            studentEmail: data.email, 
            studentName:data.studentName, 
            downloadURL:certificateUrl
        });
        
         //  send certificate via EmailJS
        await sendCertificateEmail({
            toEmail: data.email,
            studentName: data.studentName,
            certificateUrl,
        });
        
        reset({
            studentName: "",
            email: "",
            feedback: "",
            course: workshop.workshopName
        });
        // reset otp states
        setEnteredOtp("");
        setOtpSent(false);
        setEmailVerified(false);
        setSuccess(true);
        } catch (error) {
            console.error('Error submitting feedback:', error);   
        }
 };

    if(loading) return <p>Loading...</p>;
    if(!workshop) return <p>Invalid link or Form not found</p>;

    // success screen
    if(success){
            return(
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <Card className="w-full max-w-md p-8 text-center shadow-xl space-y-4">
                        <h2 className="text-2xl font-bold">Thank You!</h2>
                        <p>Your certificate has been sent to your email.</p>
                        <Button
                        className="w-full"
                        onClick={() => setSuccess(false)}
                        >
                         Submit Another Response
                        </Button>
                    </Card>
                </div>
            );
        }

    return(
        <>
       <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10'>
            <Card className="w-full max-w-2xl shadow-2xl border bg-white">
                {/* header section */}
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold">
                    Workshop Feedback
                </CardTitle>
                <p className="text-gray-500 text-sm">
                    Please share your experience and receive your certificate instantly.
                </p>
            </CardHeader>

            <Separator/>

        <CardContent className="pt-6 space-y-6">
            <div className="rounded-lg border bg-gray-50 p-4 space-y-1 text-sm">
                <p><strong className="font-semibold">Workshop Name : </strong>{workshop.workshopName}</p>
                <p><strong className="font-semibold">College  : </strong>{workshop.collegeName}</p>
                <p><strong className="font-semibold">Date : </strong>{workshop.date}</p>
                <p><strong className="font-semibold">Time : </strong>{workshop.time}</p>
               <p><strong className="font-semibold">Instructions : </strong>{workshop.instructions}</p>
            </div>

            <Separator/>

            {/* feedback form */}
            <form onSubmit={handleSubmit(onSubmit)} className = "space-y-5">
                {/* studentName */}
            <div className="space-y-2">
            <Label htmlFor = "studentName">Student Name</Label>
            <Input
            id="studentName"
            placeholder="Enter Your Name"
            {...register("studentName")}
            />
            <FormError message = {errors. studentName?.message}/>
            </div>

            <div className="space-y-2">
                <Label htmlFor = "course">Workshop Name</Label>
                <Input
                id = "course"
                value = {workshop.workshopName}
                readOnly
                 {...register("course")}
                 className="bg-gray-100 cursor-not-allowed"
                />
            </div>

         {/* Email & OTP */}
            <div className="space-y-2">
                <Label htmlFor = "email">Email Address</Label>
                <Input
                id = "email"
                type = "email"
                placeholder="Enter your email"
                {...register("email")}
                />
                <FormError message={errors.email?.message}/>
                {email && email.includes("@") && !otpSent && (
                    <Button type = "button" onClick={() =>generateAndSendOtp(email, workshop.workshopName)}
                    disabled={otpLoading} className="w-full mt-1"
                    >
                       {otpLoading ? "Sending OTP..." : "Send OTP to Email"}
                    </Button>
                )}
                {otpSent && (
                    <div className="space-y-2 pt-2">
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                        id="otp"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ""))}
                        />
                        <Button type="button" onClick={verifyOTP} className="w-full"> Verify OTP</Button>
                        {emailVerified && <p className="text-green-600 text-sm font-medium">Emai Verified Successfully</p>}
                    </div>
                )}
            </div>

             <div className="space-y-2">
                <Label htmlFor = "instructions">Your Feedback</Label>
                <Textarea
                id = "feedback"
                placeholder = "Write your feedback here..."
                {...register("feedback")}
                className="min-h-[120px]"
                />
                <FormError message={errors.feedback?.message} /> 
            </div>

            {/* Submit button */}
           <Button type = "submit" disabled = {!emailVerified || isSubmitting} className="w-full h-11 text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition rounded-xl"> 
            {isSubmitting ? "Submitting..." : "Submit & Get Certificate"}
            </Button>
        </form>
         </CardContent>
          </Card>
          </div>
          </>
)};       

export default FeedbackForm;


