import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { RegistrationProps } from '../emails/utils';
import fs from 'fs';

export async function generateRegistrationPDF(data: RegistrationProps): Promise<Buffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const { 
    firstname, lastname, birthdate, mail, Phone, Sexe, Address, 
    City, CodePostal, Country, PictureFile, EmergencyContactName1, 
    EmergencyContactPhone1, EmergencyContactName2, EmergencyContactPhone2, MedicalComment 
  } = data;

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const fontSize = 12;

  page.drawText(`Nom: ${firstname} ${lastname}`, { x: 50, y: 750, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Date de naissance: ${birthdate.toLocaleDateString('fr')}`, { x: 50, y: 730, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Email: ${mail}`, { x: 50, y: 710, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Téléphone: ${Phone}`, { x: 50, y: 690, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Sexe: ${Sexe}`, { x: 50, y: 670, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Adresse: ${Address}, ${CodePostal} ${City}, ${Country}`, { x: 50, y: 650, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Contact d'urgence 1: ${EmergencyContactName1} - ${EmergencyContactPhone1}`, { x: 50, y: 630, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });
  page.drawText(`Contact d'urgence 2: ${EmergencyContactName2} - ${EmergencyContactPhone2}`, { x: 50, y: 610, size: fontSize, font: timesRomanFont, color: rgb(0, 0, 0) });

  if (MedicalComment) {
    page.drawText(`Commentaire médical: ${MedicalComment}`, { x: 50, y: 590, size: fontSize, font: timesRomanFont, color: rgb(1, 0, 0) });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
