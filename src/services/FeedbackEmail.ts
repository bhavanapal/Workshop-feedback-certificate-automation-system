import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

interface FeedbackLinkEmailParams {
    toEmail: string;
    workshopName: string;
    message: string;
}

export const sendFeedbackLinkEmail = (data: FeedbackLinkEmailParams): Promise<EmailJSResponseStatus> => {
    return emailjs.send (
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_FEEDBACK_TEMPLATE_ID,
        {
            to_email: data.toEmail,
            workshop_name: data.workshopName,
            message: data.message
        }, 
       import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    );
};