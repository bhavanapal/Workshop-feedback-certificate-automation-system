import { storage } from "@/config/appwriteconfig";
import { ID } from "appwrite";

// function to upload certificate to appwrite storage
export const uploadCertificate = async(pdfBlob: Blob, fileName: string): Promise<string> => {
    try{
        // ensure safe file name(replace spaces with underscores)
        const safeFileName = fileName.replace(/\s+/g, "_")+ ".pdf";

        // create file on Appwrite storage bucket
        const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_TEMPLATES as string;

        // convert Blob -> file (very important)
        const file = new File([pdfBlob], `${safeFileName}.pdf`, {
            type: "application/pdf",
        });

        // upload the file to appwrite storage
        const response = await storage.createFile({bucketId, fileId:ID.unique(), file});

        // generate file preview/download URL
        const fileUrl = storage.getFileDownload({bucketId , fileId:response.$id});

        // return the file URL to access the uploaded certificate
        return fileUrl.toString();
    } catch(error){
        console.error("Error uploading certificate to Appwrite:", error);
        throw error;
    }
};