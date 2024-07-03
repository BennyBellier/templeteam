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
