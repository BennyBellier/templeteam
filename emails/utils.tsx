import { DayOfWeek } from "@prisma/client";

export interface ContactProps {
  name: string;
  mail: string;
  subject: string;
  message: string;
}

export const baseUrl = process.env.URL
  ? `https://${process.env.URL}`
  : "http://localhost:3000";

export type cours = {
  templeRun: boolean;
  templeGym: boolean;
  templeGymJunior: boolean;
  templeBreak: boolean;
};

export interface EndOfTrialsProps {
  courses: {
    name: string;
    sessions: {
      dayOfWeek: DayOfWeek;
      startHour: Date;
      endHour: Date;
      place: string;
      city: string;
      postalCode: string;
      query: string;
    }[];
  }[];
  price: number;
  memberId: string;
}

export function translateDayOfWeek(day: DayOfWeek) {
  switch (day) {
    case "Monday":
      return "Lundi";
    case "Tuesday":
      return "Mardi";
    case "Wednesday":
      return "Mercredi";
    case "Thursday":
      return "Jeudi";
    case "Friday":
      return "Vendredi";
    case "Saturday":
      return "Samedi";
    case "Sunday":
      return "Dimanche";
  }
}