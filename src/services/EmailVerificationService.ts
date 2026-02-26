import { sendFeedbackLinkEmail } from "./FeedbackEmail";

export const sendOtpForVerification = async (email: string, workshopName: string, otp: string)=>{
  const sent = await sendFeedbackLinkEmail({
            toEmail: email,
            workshopName: workshopName,
            message: `Your OTP is ${otp}`,
        });

        if (sent) {
            alert('OTP sent to your email!please check your inbox.');
          console.log("OTP sent successfully!");
        } else {
            alert('Failed to send OTP.Please try again.');
            console.error("Failed to send OTP.Please try again.");
        }
}; 

