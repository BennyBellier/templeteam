import fs from 'fs';
import path from 'path';

export interface ReferenceProps {
  name: string;
  href: string;
  logo: string;
  alt: string;
}

export default function handler(req, res) {
  try {
    const referencesJSON = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'references.json'), 'utf8');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const references: ReferenceProps[] = JSON.parse(referencesJSON);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    res.status(200).json(references);
  } catch (error) {
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    res.status(500).json({ error: error });
  }
}