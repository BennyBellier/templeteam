"use client";

import type { BlogCategory } from "@prisma/client";
import { createContext, useContext, useState, type ReactNode } from "react";

interface ReferenceCategoryContextValue {
  category: BlogCategory | undefined;
  setCategory: React.Dispatch<React.SetStateAction<BlogCategory | undefined>>;
}

/*
  Context for export Category selector out of page !
*/
const BlogCategoryContext = createContext<
  ReferenceCategoryContextValue | undefined
>(undefined);

export function useBlogCategory() {
  const context = useContext(BlogCategoryContext);
  if (context === undefined) {
    throw new Error("useBlogCategory must be inside a BlogCategoryProvider");
  }
  return context;
}

export const BlogCategoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [category, setCategory] = useState<BlogCategory | undefined>("ALL");

  return (
    <BlogCategoryContext.Provider value={{ category, setCategory }}>
      {children}
    </BlogCategoryContext.Provider>
  );
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return <BlogCategoryProvider>{children}</BlogCategoryProvider>;
}
