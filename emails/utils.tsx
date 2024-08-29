export interface ContactProps {
  name: string;
  mail: string;
  subject: string;
  message: string;
}

export interface RegistrationProps {
  firstname: string,
  lastname: string,
  birthdate: Date,
  mail: string,
  Phone: string,
  Sexe: string,
  Address: string,
  City: string,
  CodePostal: string,
  Country: string,
  PictureFile: File | null,
  EmergencyContactName1: string,
  EmergencyContactPhone1: string,
  EmergencyContactName2: string,
  EmergencyContactPhone2: string,
  MedicalComment: string
}

export const baseUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";
