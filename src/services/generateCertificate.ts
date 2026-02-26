import template from "@/assets/certificate-template.png";
import {PDFDocument, rgb, StandardFonts } from 'pdf-lib';

interface CertificateData {
    studentName: string;
    course: string;
    date: string;
    collegeName: string;
}

export const generateCertificate = async (data: CertificateData): Promise<Blob> =>{

     try{
      // create a new PDF document
      const pdfDoc = await PDFDocument.create();

      // load background image
      const imageBytes = await fetch(template).then(res => res.arrayBuffer());
      const image = await pdfDoc.embedPng(imageBytes);

      const page = pdfDoc.addPage([image.width, image.height]);

      // draw background image
      page.drawImage(image, {
        x:0,
        y:0,
        width:image.width,
        height:image.height,
      });

      const{width, height} = page.getSize();

      //  load fonts properly
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // student name
      const nameSize = 40;
      const nameWidth = boldFont.widthOfTextAtSize(data.studentName, nameSize);

       // Add the student
      page.drawText(data.studentName.toUpperCase(),{
        x:(width - nameWidth) / 2,
        y: height / 2 + 20,
        size: nameSize,
        font:boldFont,
        color: rgb(0,0,0),
      });

      // add course/workshop name
        const description =`has successfully completed the workshop: "${data.course}" conducted at ${data.collegeName} on ${data.date}.`;
        const descSize = 18;
        const descWidth = regularFont.widthOfTextAtSize(
          description,
          descSize
        );

        page.drawText(description,{
        x:(width - descWidth) / 2,
        y: height / 2 - 40,
        size: descSize,
        font: regularFont,
        color: rgb(0,0,0),
      });

      // footer(left & right)
      const footerSize = 16;
      const footerY = 120 + 60;
      // left side
      page.drawText(data.collegeName, {
        // x: horizontalPadding,
        x: 100,
        y: footerY,
        size: footerSize,
        font: regularFont,
        color: rgb(0,0,0),
      });

      // right side
      const dateWidth = regularFont.widthOfTextAtSize(
        data.date,
        footerSize
      );

      page.drawText(data.date,{
        x: width - dateWidth - 100,
        y: footerY,
        size: footerSize,
        font: regularFont,
        color: rgb(0,0,0),
      });

      // save the pdf as bytes and convert it to an ArrayBuffer
      const pdfBytes = await pdfDoc.save();
      const pdfBuffer = pdfBytes.buffer as ArrayBuffer;

      // convert the ArrayBuffer to a Blob
      const pdfBlob = new Blob([pdfBuffer], {type: "application/pdf"});
      return pdfBlob;
     } catch (err) {
      console.error("Error generating certificate:", err);
      throw err;
     }
};
  






































