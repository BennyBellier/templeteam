// "use server";

// import { PDFDocument, drawText, rgb } from "pdf-lib";
// import { RegistrationProps } from "emails/AssociationRegistration";
// import fs from "fs";
// import path from "path";
// import fontkit from "@pdf-lib/fontkit";

// export async function generateRegistrationPDF(
//   data: RegistrationProps,
// ): Promise<Buffer> {
//   try {
//     const uint8Array = fs.readFileSync(
//       path.join(
//         process.cwd(),
//         "public",
//         "static",
//         "Template_dossier_inscription_2024-2025.pdf",
//       ),
//     );
//     const pdfDoc = await PDFDocument.load(uint8Array);

//     pdfDoc.registerFontkit(fontkit);

//     const pages = pdfDoc.getPages();

//     const { width, height } = pages[0]?.getSize()!;

//     // Charger la police d'écriture
//     const centuryGothicPath = path.join(
//       process.cwd(),
//       "fonts",
//       "centurygothic.ttf",
//     );
//     const centuryGothicBoldPath = path.join(
//       process.cwd(),
//       "fonts",
//       "centurygothic_bold.ttf",
//     );

//     var centuryGothicBytes = fs.readFileSync(centuryGothicPath); // Read the font file
//     const centuryGothic = await pdfDoc.embedFont(centuryGothicBytes);

//     var centuryGothicBoldBytes = fs.readFileSync(centuryGothicBoldPath); // Read the font file
//     const centuryGothicBold = await pdfDoc.embedFont(centuryGothicBoldBytes);

//     var page = pages[0];

//     page?.setFont(centuryGothic);
//     page?.setFontSize(11);
//     page?.setFontColor(rgb(0, 0, 0));

//     /*
//      * Licensee informations
//      */

//     const licenseeXOffset = 110;
//     const licenseeYOffset = {
//       lastname: height - 198,
//       firstname: height - 218,
//       sexe: height - 238,
//       birthdate: height - 263,
//       address: height - 286,
//       codePostal: height - 306,
//       city: height - 326,
//       country: height - 346,
//       phone: height - 366,
//       mail: height - 386,
//     };

//     const RL1 = {
//       name: { x: 401, y: height - 202 },
//       phone: { x: 401, y: height - 222 },
//     };

//     const RL2 = {
//       name: { x: 401, y: height - 300 },
//       phone: { x: 401, y: height - 320 },
//     };

//     page?.drawText(data.lastname, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.lastname,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.firstname, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.firstname,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.Sexe, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.sexe,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.birthdate.toLocaleDateString("fr-FR"), {
//       x: licenseeXOffset,
//       y: licenseeYOffset.birthdate,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.Address, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.address,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.CodePostal, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.codePostal,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.City, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.city,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.Country, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.country,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.Phone, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.phone,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.mail, {
//       x: licenseeXOffset,
//       y: licenseeYOffset.mail,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.EmergencyContactName1, {
//       x: RL1.name.x,
//       y: RL1.name.y,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.EmergencyContactPhone1, {
//       x: RL1.phone.x,
//       y: RL1.phone.y,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.EmergencyContactName2, {
//       x: RL2.name.x,
//       y: RL2.name.y,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.EmergencyContactPhone2, {
//       x: RL2.phone.x,
//       y: RL2.phone.y,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     /**
//      * Authorizations
//      */

//     page = pages[1];

//     page?.setFont(centuryGothic);
//     page?.setFontSize(11);
//     page?.setFontColor(rgb(0, 0, 0));

//     page?.drawText(data.City, {
//       x: 403,
//       y: height - 377,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     page?.drawText(data.creationDate.toLocaleDateString("fr-FR"), {
//       x: 388,
//       y: height - 400,
//       size: 11,
//       color: rgb(0, 0, 0),
//     });

//     const base64Data = data.Signature.replace(/^data:image\/png;base64,/, "");
//     const signatureBytes = Uint8Array.from(atob(base64Data), (char) =>
//       char.charCodeAt(0),
//     );

//     const signatureImage = await pdfDoc.embedPng(signatureBytes);

//     const signatureWidth = 175;
//     const signatureDims = signatureImage.scale(1); // Obtenir les dimensions originales
//     const aspectRatio = signatureDims.width / signatureDims.height;
//     const proportionalHeight = signatureWidth / aspectRatio;

//     page?.drawImage(signatureImage, {
//       x: 350, // Coordonnées X de la signature
//       y: height - 550, // Coordonnées Y de la signature
//       width: signatureWidth,
//       height: proportionalHeight,
//     });

//     /**
//      * Payment
//      */

//     page = pages[2];

//     page?.drawText(data.lastname.toUpperCase(), {
//       x: 284,
//       y: height - 277,
//       size: 11,
//       color: rgb(0, 0, 0),
//       font: centuryGothicBold,
//     });

//     page?.drawText(data.firstname, {
//       x: 284,
//       y: height - 298,
//       size: 11,
//       color: rgb(0, 0, 0),
//       font: centuryGothicBold,
//     });

//     const genDate = new Date();

//     page?.drawText(
//       genDate.toLocaleDateString("fr-FR", {
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//       }),
//       {
//         x: 256,
//         y: height - 410,
//         size: 11,
//         color: rgb(0, 0, 0),
//         font: centuryGothic,
//       },
//     );

//     const pdfBytes = await pdfDoc.save();

//     try {
//       fs.writeFileSync(
//         path.join(process.cwd(), "public", "static", "output.pdf"),
//         pdfBytes,
//       );
//     } catch (err) {
//       console.error("Error writing PDF file:", err);
//     }

//     return Buffer.from(pdfBytes);
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     throw error;
//   }
// }
