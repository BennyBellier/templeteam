import { env } from "@/env.mjs";
import path from "path";

// Types pour la sécurité
type PathContext = "server" | "public";

interface PathConfig {
  serverBase: string;
  publicBase: string;
  allowPublic?: boolean;
}

const TEMP_DIR = path.join(process.cwd(), env.TEMP_FOLDER);
const PUBLIC_DIR = path.join(process.cwd(), "public");
const STATIC_DIR = path.join(PUBLIC_DIR, env.STATIC_FOLDER);
const ASSOCIATION_DIR = path.join(STATIC_DIR, env.ASSOCIATION_FOLDER);

// Classe générique pour gérer les chemins
class PathGenerator {
  constructor(private config: PathConfig) {}

  private buildPath(context: PathContext, segments: string[]): string {
    if (context === "public" && !this.config.allowPublic) {
      throw new Error("Public access not allowed for this path");
    }

    if (context === "server") {
      const fullPath = path.join(this.config.serverBase, ...segments);
      const normalized = path.normalize(fullPath);

      if (!normalized.startsWith(path.normalize(this.config.serverBase))) {
        throw new Error("Path traversal detected");
      }

      return fullPath;
    } else {
      return [this.config.publicBase, ...segments]
        .join("/")
        .replace(/\/+/g, "/");
    }
  }

  server(...segments: string[]): string {
    return this.buildPath("server", segments);
  }

  public(...segments: string[]): string {
    return this.buildPath("public", segments);
  }

  both(...segments: string[]): { server: string; public: string } {
    return {
      server: this.server(...segments),
      public: this.public(...segments),
    };
  }
}

export const paths = {
  temp: new PathGenerator({
    serverBase: TEMP_DIR,
    publicBase: "/",
    allowPublic: false,
  }),

  // Racine des fichiers statiques
  static: new PathGenerator({
    serverBase: STATIC_DIR,
    publicBase: "/static",
    allowPublic: true,
  }),

  // Dossier association (certificat médical, etc.)
  association: new PathGenerator({
    serverBase: ASSOCIATION_DIR,
    publicBase: "/static/association",
    allowPublic: true,
  }),

  // Générateur pour les membres avec helpers spécifiques
  members: {
    /**
     * Chemin vers le dossier d'un membre
     */
    root: (memberId: string) => {
      const generator = new PathGenerator({
        serverBase: path.join(ASSOCIATION_DIR, "members", memberId),
        publicBase: `/static/association/members/${memberId}`,
        allowPublic: true,
      });
      return generator;
    },

    /**
     * Chemin vers le dossier files d'un membre
     */
    files: (memberId: string) => {
      const generator = new PathGenerator({
        serverBase: path.join(ASSOCIATION_DIR, "members", memberId, "files"),
        publicBase: `/static/association/members/${memberId}/files`,
        allowPublic: true,
      });
      return generator;
    },

    /**
     * Chemin vers le dossier medical d'un membre
     */
    medical: (memberId: string) => {
      const generator = new PathGenerator({
        serverBase: path.join(ASSOCIATION_DIR, "members", memberId, "medical"),
        publicBase: `/static/association/members/${memberId}/medical`,
        allowPublic: true,
      });
      return generator;
    },

    /**
     * Chemin vers le dossier photos d'un membre
     */
    photos: (memberId: string) => {
      const generator = new PathGenerator({
        serverBase: path.join(ASSOCIATION_DIR, "members", memberId, "photos"),
        publicBase: `/static/association/members/${memberId}/photos`,
        allowPublic: true,
      });
      return generator;
    },
  },
} as const;

/**
 * Type pour les catégories de fichiers membres
 */
export type MemberFileCategory = "files" | "medical" | "photos";

/**
 * Helper pour obtenir le générateur de chemin d'une catégorie
 */
export function getMemberPath(
  memberId: string,
  category: MemberFileCategory,
): PathGenerator {
  return paths.members[category](memberId);
}

/**
 * Constantes pour les fichiers statiques communs
 */
export const STATIC_FILES = {
  certificatMedical: {
    server: path.join(ASSOCIATION_DIR, "certificat_medical.pdf"),
    public: "/static/association/certificat_medical.pdf",
  },
  File: {
    server: path.join(
      ASSOCIATION_DIR,
      "Template_dossier_inscription_2025-2026.pdf",
    ),
    public: "/static/association/Template_dossier_inscription_2025-2026.pdf",
  },
} as const;
