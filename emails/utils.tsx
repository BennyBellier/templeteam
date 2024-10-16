export interface ContactProps {
  name: string;
  mail: string;
  subject: string;
  message: string;
}

export interface RegistrationProps {
  firstname: string;
  lastname: string;
  birthdate: Date;
  mail: string;
  Phone: string;
  gender: string;
  Address: string;
  City: string;
  CodePostal: string;
  Country: string;
  PictureFile: string;
  EmergencyContactName1: string;
  EmergencyContactPhone1: string;
  EmergencyContactName2: string;
  EmergencyContactPhone2: string;
  MedicalComment: string;
  templeRun: boolean;
  templeGym: boolean;
  templeBreak: boolean;
  templeGymJunior: boolean;
}

export const baseUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";


  export type cours = {
  templeRun: boolean,
  templeGym: boolean,
  templeGymJunior: boolean
  templeBreak: boolean,
};

export interface EndOfTrialsProps {
  cours: cours,
  memberId: string,
}

  export const calculCotisation = (cours: cours) => {
    let cotisation = 20;

    if (cours.templeRun && !cours.templeGym && !cours.templeGymJunior) {
      cotisation += 200
    } else if (cours.templeRun && cours.templeGym && !cours.templeGymJunior) {
      cotisation += 200 + (200*0.6)
    } else if (cours.templeRun && !cours.templeGym && cours.templeGymJunior) {
      cotisation += 200 + (180*0.6)
    } else if (!cours.templeRun && cours.templeGym && !cours.templeGymJunior) {
      cotisation += 200
    } else if (!cours.templeRun && !cours.templeGym && cours.templeGymJunior) {
      cotisation += 180
    }

    return cotisation;
  }