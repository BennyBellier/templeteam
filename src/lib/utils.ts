/* eslint-disable */
import { env } from "@/env.mjs";
import { BlogCategory } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { differenceInYears, isBefore } from "date-fns";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function categoryToText(category: BlogCategory) {
  switch (category) {
    case BlogCategory.ALL:
      return "Tous";
    case BlogCategory.ARTICLE:
      return "Article";
    case BlogCategory.EVENT:
      return "Événement";
    case BlogCategory.INFORMATION:
      return "Information";

    default:
      return "";
  }
}

export function associationPositionToText(position: string): string {
  switch (position) {
    case "President":
      return "Président";
    case "Vice President":
      return "Vice-Président";
    case "Secretary":
      return "Secrétaire";
    case "Vice Secretary":
      return "Vice Secrétaire";
    case "Treasure":
      return "Trésorier";

    default:
      return "";
  }
}

export function getCountriesNames(lang = "fr") {
  const countries = require("i18n-iso-countries");

  countries.registerLocale(
    require("i18n-iso-countries/langs/" + lang + ".json"),
  );
  const jsonObject = countries.getNames(lang, { select: "official" });

  return Object.keys(jsonObject)
    .map((key) => jsonObject[key])
    .sort((a, b) => {
      if (a && b) return a.localeCompare(b);
      return 0;
    });
}

export const phoneRegex = new RegExp(/^\+33 (?:0)?[67](?: [0-9]{2}){4}$/);

export const calculateAge = (input: string | Date): number => {
  const today = new Date();
  const birthDate = new Date(input);

  let age = differenceInYears(today, birthDate);

  // Vérifier si l'anniversaire est passé cette année
  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  if (isBefore(today, thisYearBirthday)) {
    age--; // Si l'anniversaire n'est pas encore passé
  }

  return age;
};

export const displayTime = (date: Date) => {
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();

  if (minutes < 10) {
    return `${hours}:0${minutes}`;
  }
  return `${hours}:${minutes}`;
};

/* export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
} */

export const calculateMembershipPrice = (
  oldMember: boolean,
  courses: number[],
) => {
  if (oldMember) {
    return courses.reduce((sum, price) => sum + price, 0);
  }
  return (
    env.INSURANCE_MEMBERSHIP_PRICE +
    courses.reduce((sum, price) => sum + price, 0)
  );
};

export const resultSchema = <T extends z.ZodTypeAny>(data: T) =>
  z.union([
    z.object({ ok: z.literal(true), data }),
    z.object({ ok: z.literal(false), error: z.string() }),
  ]);

export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export async function handleResult<T>(
  promise: Promise<Result<T>>,
  toastId?: string,
  duration?: number,
): Promise<T | null> {
  const res = await promise;
  if (!res.ok) {
    toast.error(res.error, {
      id: toastId,
      duration: duration ?? 5000,
    });
    return null;
  }
  return res.data;
}

export function getPreviousSeason(season: string): string {
  const [start, end] = season.split("/").map(Number);
  if (!start || !end) {
    throw new Error(`Invalid season format: ${season}`);
  }
  return `${start - 1}/${end - 1}`;
}
