import fs from "fs";
import path from "path";
import { type ReferenceProps } from "~/utils/types";

export function getReferences() {
  const referencesJSON = fs.readFileSync(
    path.join(process.cwd(), "src", "data", "references.json"),
    "utf8"
  );

  console.log("JSON :", referencesJSON);

  const references: ReferenceProps[] = JSON.parse(
    referencesJSON
  ) as ReferenceProps[];

  console.log(references);
  return references;
}
