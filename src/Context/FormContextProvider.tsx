import {useEffect, useState, useCallback} from "react";
import type {ReactNode} from "react";
import {FormContext } from "./FormContext.ts";
import type { WorkshopData } from "./FormContext.ts";
import { useAuth } from "./AuthContext.ts";
import { generateRandomLink } from "@/utils/generateRandomLink.ts";
import { tablesDB } from "@/config/appwriteconfig.ts";
import {ID, Query} from "appwrite";
import { sendFeedbackLinkEmail } from "@/services/FeedbackEmail.ts";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_WORKSHOPS_COLLECTION;
const SUBMISSION_ID = import.meta.env.VITE_APPWRITE_FEEDBACK_COLLECTION;

const FormContextProvider = ({children}:{children:ReactNode}) => {
 const {user, loading} = useAuth();
 const [formData, setFormData] = useState<WorkshopData[]>([]);
 const [totalSubmissions, setTotalSubmissions] = useState(0);

// fetch forms created by logged-in admin
const fetchForms = useCallback(async () => {
    if(!user) return;

    try{
        const response = await tablesDB.listRows({
          databaseId:DATABASE_ID,
          tableId:COLLECTION_ID,
          queries:[Query.equal("createdBy", user.uid)],
    });
        const list: WorkshopData[] = response.rows.map((row)=> ({
          id: row.$id,
          collegeName: row.collegeName,
          workshopName: row.workshopName,
          date:row.date,
          time:row.time,
          instructions:row.instructions,
          studentEmail:row.studentEmail,
          status:row.status,
          uniqueLink: row.uniqueLink,
          createdBy:row.createdBy,
          createdAt:row.$createdAt,
        }));
        setFormData(list);
    } catch(error){
        console.error("Error fetching forms:", error);
    }
},[user]);

// create new workshop form
const createForm = useCallback(
    async(
        form: Omit<WorkshopData, "id" | "uniqueLink" | "createdAt" | "createdBy" | "status">
    ) => {
        if(!user) return;

        try{
            await tablesDB.createRow({
                databaseId: DATABASE_ID,
                tableId: COLLECTION_ID,
                rowId:ID.unique(),
               data: {
                    ...form,
                    status:false,
                    uniqueLink: null,
                    createdBy: user.uid,
                },
        });
        await fetchForms();
        } catch (error) {
            console.error("Error creating form:", error);
        }
    },
    [user, fetchForms]
);

// toggle form status
const toggleStatus = useCallback(
    async(formId:string, newStatus:boolean) => {
        try{
            let generatedLink: string | null = null;
            if(newStatus){
                generatedLink = generateRandomLink(12);
            }
            await tablesDB.updateRow({
                databaseId:DATABASE_ID,
                tableId:COLLECTION_ID,
                rowId:formId,
                data:{
                    status: newStatus,
                    uniqueLink:generatedLink,
                },
        });

        if(newStatus && generatedLink){
            const form = formData.find((f) => f.id === formId);

            if(form?.studentEmail) {
                const link = `${window.location.origin}/form/${generatedLink}`; 
                await sendFeedbackLinkEmail({
                    toEmail: form.studentEmail,
                    workshopName: form.workshopName,
                    message: `Feedback link: ${link}`,
                });
            }
        }
        await fetchForms();
        } catch(error){
            console.error("Error updating status:", error);
        }
    },
    [fetchForms,formData ]
);

// feedback submissions
useEffect(() => {
    if(loading || !user) return
    const fetchSubmissions = async () => {
        try{
            const response = await tablesDB.listRows({
               databaseId:DATABASE_ID,
               tableId:SUBMISSION_ID,
               total:true,
               queries:[],
            });
            setTotalSubmissions(response.total);
        } catch(error){
            console.error("Error fetching submissions:", error);
        }
    };
    fetchSubmissions();
    },[user, loading]);

useEffect(() => {
   if(!user) return;
(async () => {
fetchForms();
  })();
},[user , fetchForms]);

return(
    <FormContext.Provider
    value={{ formData, fetchForms, createForm, toggleStatus, totalSubmissions}}
    >
    {children}
    </FormContext.Provider>
);
};

export default FormContextProvider;