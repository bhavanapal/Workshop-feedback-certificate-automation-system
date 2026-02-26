import { tablesDB} from "@/config/appwriteconfig";
import {ID} from "appwrite";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const tableId = import.meta.env.VITE_APPWRITE_CERTIFICATES_COLLECTION;

interface Certificatedata{
    studentEmail: string;
    studentName: string;
    downloadURL: string;
}

export const saveCertificateMetadata = async(data: Certificatedata) => {
    try{
        // save to appwrite database
    await tablesDB.createRow({
            databaseId,
            tableId,
            rowId:ID.unique(),
           data: {
            studentEmail: data.studentEmail,
            studentName: data.studentName,
            downloadURL: data.downloadURL,
            timestamp: new Date().toISOString(),
            }
    });
    } catch(error){
        console.error("Error saving certificate metadata:", error);
        throw error;
    }
};






