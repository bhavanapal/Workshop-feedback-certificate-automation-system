import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";

interface CertificateEmailParams {
    toEmail: string;
    studentName: string;
    certificateUrl: string;
}

export const sendCertificateEmail = async (
    data: CertificateEmailParams): Promise<EmailJSResponseStatus> => {
        return emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_CERTIFICATE_TEMPLATE_ID,
            {
                to_email: data.toEmail,
                student_name: data.studentName,
                certificate_link: data.certificateUrl,
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
          );   
    };


