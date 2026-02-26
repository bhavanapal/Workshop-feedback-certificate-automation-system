import { createContext, useContext } from "react";

export type WorkshopData = {
    id?: string;
    collegeName : string;
    workshopName : string;
    date : string;
    time : string;
    instructions : string;
    studentEmail : string;
    status:boolean;
    uniqueLink: string | null;
    createdBy: string;
    createdAt: string;
}

export type WorkshopContextType = {
    formData : WorkshopData[];
    totalSubmissions: number;
    createForm : (form: Omit<WorkshopData, "id" | "uniqueLink" | "createdAt" | "createdBy" | "status">) => Promise<void>;
    fetchForms : () => Promise<void>;
    toggleStatus : (formId: string, newStatus: boolean) => Promise<void>;
}

// create context
export const FormContext = createContext<WorkshopContextType | undefined>(undefined);

// consumer
export const useFormDataContext = () =>{
    const contexts = useContext(FormContext);
    if(!contexts){
        throw new Error('useFormDataContext must be used within a Provider')   
    }
    return contexts;
}

