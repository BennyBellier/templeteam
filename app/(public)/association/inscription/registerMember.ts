"use server";

import { env } from "@/env.mjs";
import logger from "@/server/logger";
import smtpOptions from "@/server/mail";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import RegistrationTemplate from "emails/AssociationRegistration";
import { prisma } from "@/trpc/server";
import type { Gender } from "@prisma/client";

type State = {
  membership: {
    templeRun?: boolean | undefined;
    templeGym?: boolean | undefined;
    templeBreak?: boolean | undefined;
    templeGymJunior?: boolean | undefined;
  };
  member: {
    picture: string;
    firstname: string;
    lastname: string;
    birthdate: string;
    gender: Gender;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    mail?: string | undefined;
    phoneNumber?: string | undefined;
  };
  legalGuardian: {
    legalGuardianName1: string;
    legalGuardianPhone1: string;
    legalGuardianName2?: string | undefined;
    legalGuardianPhone2?: string | undefined;
  } | null;
  authorization: {
    undersigned: string;
    emergencyAuthorization: boolean;
    travelAuthorization: boolean;
    imageRights: boolean;
    theftLossLiability: boolean;
    refund: boolean;
    internalRules: boolean;
    signature: string;
  };
  medic: {
    medicalCertificate: boolean;
    medicalComments?: string | undefined;
  };
  isAdult: boolean;
};

export default async function registerMember({
  membership,
  member,
  legalGuardian,
  authorization,
  medic,
  isAdult,
}: State) {
  const membershipArray = [];
  if (membership.templeRun) membershipArray.push("templeRun");
  if (membership.templeGym) membershipArray.push("templeGym");
  if (membership.templeGymJunior) membershipArray.push("templeGymJunior");
  if (membership.templeBreak) membershipArray.push("templeBreak");

  const createMemberData = {
    firstname: member?.firstname,
    lastname: member?.lastname,
    birthdate: new Date(member?.birthdate),
    gender: member?.gender,
    mail: member?.mail,
    phoneNumber: member?.phoneNumber,
    address: member?.address,
    city: member?.city,
    postalCode: member?.postalCode,
    country: member?.country,
    picture: member?.picture,
    medicalComment: medic?.medicalComments,
    undersigner: authorization.undersigned,
    signature: authorization.signature,
  };

  logger.info(createMemberData);

  const memberId = await prisma.association.createMember(createMemberData);

  if (!isAdult) {
    const emergencydata1 = {
      name: legalGuardian?.legalGuardianName1 ?? "inconu",
      phone: legalGuardian?.legalGuardianPhone1 ?? "000",
      memberId: memberId,
      level: 1,
    };

    await prisma.association.createLegalGuardian(emergencydata1);

    if (legalGuardian?.legalGuardianName2 !== undefined) {
      const emergencydata2 = {
        name: legalGuardian?.legalGuardianName2,
        phone: legalGuardian?.legalGuardianPhone2 ?? "000",
        memberId: memberId,
        level: 2,
      };

      await prisma.association.createLegalGuardian(emergencydata2);
    }
  }

  /* Envoie du mail récapitulatif */
  if (memberId) {
    const mailData = {
      firstname: member.firstname,
      lastname: member.lastname,
      birthdate: new Date(member.birthdate),
      mail: member.mail ?? "inconnu",
      Phone: member.phoneNumber ?? "",
      gender: member.gender,
      Address: member.address,
      City: member.city,
      CodePostal: member.postalCode,
      Country: member.country,
      PictureFile: member.picture?.at(0) ?? "",
      legalGuardianName1:
        legalGuardian?.legalGuardianName1 ?? "inconu",
      legalGuardianPhone1: legalGuardian?.legalGuardianPhone1 ?? "000",
      legalGuardianName2:
        legalGuardian?.legalGuardianName2 ?? "inconu",
      legalGuardianPhone2: legalGuardian?.legalGuardianPhone2 ?? "000",
      MedicalComment: medic.medicalComments ?? "",
      templeBreak: membership.templeBreak ?? false,
      templeGym: membership.templeGym ?? false,
      templeGymJunior: membership.templeGymJunior ?? false,
      templeRun: membership.templeRun ?? false,
    };

    /* Mail à l'adhérent */
    const transporter = nodemailer.createTransport({ ...smtpOptions });

    const sended = await transporter.sendMail({
      from: env.REGISTER_MAIL,
      to: member.mail,
      subject: `Confirmation de la pré-inscription de ${mailData.lastname} ${mailData.firstname}`,
      replyTo: env.NOREPLY_MAIL,
      html: render(RegistrationTemplate(mailData)),
      attachments: [
        {
          path: `${process.cwd()}/public/association/certificat_medical.pdf`,
        },
      ],
    });

    logger.info({ type: "mail", page: "inscription", message: sended });

    /* Mail de sauvegarder */
    await transporter.sendMail({
      from: env.REGISTER_MAIL,
      to: env.REGISTER_MAIL,
      subject: `Confirmation de la pré-inscription de ${mailData.lastname} ${mailData.firstname}`,
      replyTo: env.NOREPLY_MAIL,
      text: JSON.stringify({
        membership,
        member,
        legalGuardian,
        authorization,
        medic,
        isAdult,
      }),
    });

    return sended;
  }
}