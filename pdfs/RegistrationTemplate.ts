"use server";

import { calculateMembershipPrice } from "@/lib/utils";
import { writeMemberFile } from "@/server/fs/files-manipulation";
import { paths, STATIC_FILES } from "@/server/fs/paths";
import { prisma } from "@/trpc/server";
import fontkit from "@pdf-lib/fontkit";
import { Gender } from "@prisma/client";
import fs from "fs";
import path from "path";
import { PDFDocument, type PDFImage, rgb } from "pdf-lib";
import z from "zod";

const RegistrationPDFProps = z.uuidv4();

export async function generateRegistrationPDF(id: string): Promise<Buffer> {
  const { data: memberId, success } = RegistrationPDFProps.safeParse(id);

  if (!success) {
    throw new Error(`Le paramètre ID n'est pas de type UUID.`);
  }

  const data = await prisma.association.getMemberRegistrationFileInfo({
    memberId,
  });

  if (!data || !data.files[0]) {
    throw new Error(`Aucun fichiers existant pour le membre ${memberId}`);
  }
  try {
    const uint8Array = fs.readFileSync(STATIC_FILES.File.server);
    const pdfDoc = await PDFDocument.load(uint8Array);

    pdfDoc.registerFontkit(fontkit);

    const pages = pdfDoc.getPages();

    if (!pages || pages.length < 1)
      throw new Error("Echec du chargement du fichier pdf");

    const { height } = pages[0] ? pages[0].getSize() : { height: 0 };

    // Charger la police d'écriture
    const centuryGothicPath = path.join(
      process.cwd(),
      "fonts",
      "centurygothic.ttf",
    );
    const centuryGothicBoldPath = path.join(
      process.cwd(),
      "fonts",
      "centurygothic_bold.ttf",
    );

    const centuryGothicBytes = fs.readFileSync(centuryGothicPath); // Read the font file
    const centuryGothic = await pdfDoc.embedFont(centuryGothicBytes);

    const centuryGothicBoldBytes = fs.readFileSync(centuryGothicBoldPath); // Read the font file
    const centuryGothicBold = await pdfDoc.embedFont(centuryGothicBoldBytes);

    let page = pages[0];

    page?.setFont(centuryGothic);
    page?.setFontSize(11);
    page?.setFontColor(rgb(0, 0, 0));

    /*
     * Licensee informations
     */

    const licenseeXOffset = 110;
    const licenseeYOffset = {
      lastname: height - 198,
      firstname: height - 218,
      sexe: height - 238,
      birthdate: height - 263,
      address: height - 286,
      codePostal: height - 306,
      city: height - 326,
      country: height - 346,
      phone: height - 366,
      mail: height - 386,
    };

    const LG = {
      x: 385,
      y: height - 203,
    };

    const genDate = new Date();

    if (data.photo) {
      const photoBytes = fs.readFileSync(
        paths.members.photos(memberId).server(data.photo),
      );
      let photoImage: PDFImage | null = null;
      if (data.photo.endsWith(".png")) {
        photoImage = await pdfDoc.embedPng(photoBytes);
      } else if (data.photo.endsWith(".jpg") || data.photo.endsWith(".jpeg")) {
        photoImage = await pdfDoc.embedJpg(photoBytes);
      }

      if (!photoImage) {
        throw new Error("Invalid photo format");
      }

      const photoHeight = 85;
      const photoDims = photoImage.scale(1);
      const photoAspectRatio = photoDims.width / photoDims.height;
      const photoProportionalWidth = photoHeight / photoAspectRatio;
      page?.drawImage(photoImage, {
        x: 460,
        y: height - 147,
        width: photoProportionalWidth,
        height: photoHeight,
      });
    }

    page?.drawText(data.lastname, {
      x: licenseeXOffset,
      y: licenseeYOffset.lastname,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.firstname, {
      x: licenseeXOffset,
      y: licenseeYOffset.firstname,
      size: 11,
      color: rgb(0, 0, 0),
    });

    const gender =
      data.gender === Gender.Male
        ? "Masculin"
        : data.gender === Gender.Female
          ? "Féminin"
          : "Non renseigné";

    page?.drawText(gender, {
      x: licenseeXOffset,
      y: licenseeYOffset.sexe,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.birthdate.toLocaleDateString("fr-FR"), {
      x: licenseeXOffset,
      y: licenseeYOffset.birthdate,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.address, {
      x: licenseeXOffset,
      y: licenseeYOffset.address,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.postalCode, {
      x: licenseeXOffset,
      y: licenseeYOffset.codePostal,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.city, {
      x: licenseeXOffset,
      y: licenseeYOffset.city,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.country, {
      x: licenseeXOffset,
      y: licenseeYOffset.country,
      size: 11,
      color: rgb(0, 0, 0),
    });

    const phone = data.phone ? "0" + data.phone.slice(4) : "Non renseigné";

    page?.drawText(phone, {
      x: licenseeXOffset,
      y: licenseeYOffset.phone,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(data.mail ?? "Non renseigné", {
      x: licenseeXOffset,
      y: licenseeYOffset.mail,
      size: 11,
      color: rgb(0, 0, 0),
    });

    data.legalGuardians.forEach((lg, index) => {
      page?.drawText(lg.lastname + " " + lg.firstname, {
        x: LG.x,
        y: LG.y - index * 117,
        size: 11,
        color: rgb(0, 0, 0),
      });

      page?.drawText(lg.mail ?? "Non renseigné", {
        x: LG.x,
        y: LG.y - 20 - index * 117,
        size: 11,
        color: rgb(0, 0, 0),
      });

      page?.drawText("0" + lg.phone.slice(4), {
        x: LG.x,
        y: LG.y - 40 - index * 117,
        size: 11,
        color: rgb(0, 0, 0),
      });
    });

    /**
     * Authorizations
     */

    page = pages[1];

    page?.setFont(centuryGothic);
    page?.setFontSize(11);
    page?.setFontColor(rgb(0, 0, 0));

    page?.drawText(data.city, {
      x: 403,
      y: height - 377,
      size: 11,
      color: rgb(0, 0, 0),
    });

    page?.drawText(
      data.files[0]?.createdAt.toLocaleDateString("fr-FR") ??
        genDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      {
        x: 388,
        y: height - 400,
        size: 11,
        color: rgb(0, 0, 0),
      },
    );

    const base64Data =
      data.files[0]?.signature.replace(/^data:image\/png;base64,/, "") ?? "";
    const signatureBytes = Uint8Array.from(atob(base64Data), (char) =>
      char.charCodeAt(0),
    );

    const signatureImage = await pdfDoc.embedPng(signatureBytes);

    const signatureWidth = 175;
    const signatureDims = signatureImage.scale(1);
    const aspectRatio = signatureDims.width / signatureDims.height;
    const proportionalHeight = signatureWidth / aspectRatio;

    page?.drawImage(signatureImage, {
      x: 350,
      y: height - 550,
      width: signatureWidth,
      height: proportionalHeight,
    });

    /**
     * Payment
     */

    page = pages[2];

    page?.drawText(data.lastname, {
      x: 284,
      y: height - 277,
      size: 11,
      color: rgb(0, 0, 0),
      font: centuryGothicBold,
    });

    page?.drawText(data.firstname, {
      x: 284,
      y: height - 298,
      size: 11,
      color: rgb(0, 0, 0),
      font: centuryGothicBold,
    });

    const coursesPrice = data.files[0]?.courses.map((course) => course.price);
    const paymentAmount = calculateMembershipPrice(
      data.files[0]?.createdAt <= new Date("2024-09-07 08:00:00.00000"),
      coursesPrice,
    );

    page?.drawText(`${paymentAmount.toFixed(2)} €`, {
      x: 450,
      y: height - 336,
      size: 11,
      color: rgb(0, 0, 0),
      font: centuryGothicBold,
    });

    page?.drawText(
      genDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      {
        x: 256,
        y: height - 410,
        size: 11,
        color: rgb(0, 0, 0),
        font: centuryGothic,
      },
    );

    const pdfBytes = await pdfDoc.save();

    try {
      const filename = await writeMemberFile(memberId, pdfBytes);

      await prisma.association.addFileFilename({
        fileId: data.files[0].id,
        filename,
      });
    } catch (err) {
      console.error("Error writing PDF file:", err);
    }

    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
