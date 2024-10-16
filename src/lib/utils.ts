/* eslint-disable @typescript-eslint/ban-types */
import { BlogCategory } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    case "Treasure":
      return "Trésorier";

    default:
      return "";
  }
}

export function getCountriesNames(lang = "fr") {
  var countries = require("i18n-iso-countries");

  countries.registerLocale(require("i18n-iso-countries/langs/fr.json"));
  const jsonObject = countries.getNames("fr", { select: "official" });

  return Object.keys(jsonObject)
    .map((key) => jsonObject[key])
    .sort((a, b) => {
      if (a && b) return a.localeCompare(b);
      return 0;
    });
}