"use server";

import { env } from "@/env.mjs";
import { logger } from "@/server/logger";
import smtpOptions from "@/server/mail";
import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import RegistrationTemplate from "../../../emails/AssociationRegistration";
import { prisma } from "../../../src/trpc/server";

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
    gender: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    mail?: string | undefined;
    phoneNumber?: string | undefined;
  };
  emergencyContact: {
    emergencyContactName1: string;
    emergencyContactPhone1: string;
    emergencyContactName2?: string | undefined;
    emergencyContactPhone2?: string | undefined;
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
  emergencyContact,
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
    birthdate: new Date(member?.birthdate!),
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
    membership: membershipArray,
  };

  logger.info(createMemberData);

  const memberId = await prisma.association.createMember(createMemberData);

  if (!isAdult) {
    const emergencydata1 = {
      name: emergencyContact?.emergencyContactName1!,
      phone: emergencyContact?.emergencyContactPhone1!,
      memberId: memberId,
      level: 1,
    };

    await prisma.association.createEmergencyContact(emergencydata1);

    if (emergencyContact?.emergencyContactName2 !== undefined) {
      const emergencydata2 = {
        name: emergencyContact?.emergencyContactName2,
        phone: emergencyContact?.emergencyContactPhone2!,
        memberId: memberId,
        level: 2,
      };

      await prisma.association.createEmergencyContact(emergencydata2);
    }
  }

  /* Envoie du mail récapitulatif */
  if (memberId) {
    const mailData = {
      firstname: member.firstname!,
      lastname: member.lastname!,
      birthdate: new Date(member.birthdate!),
      mail: member.mail!,
      Phone: member.phoneNumber!,
      gender: member.gender!,
      Address: member.address!,
      City: member.city!,
      CodePostal: member.postalCode!,
      Country: member.country!,
      PictureFile: member.picture?.at(0)!,
      EmergencyContactName1: emergencyContact?.emergencyContactName1!,
      EmergencyContactPhone1: emergencyContact?.emergencyContactPhone1!,
      EmergencyContactName2: emergencyContact?.emergencyContactName2!,
      EmergencyContactPhone2: emergencyContact?.emergencyContactPhone2!,
      MedicalComment: medic.medicalComments!,
      templeBreak: membership.templeBreak!,
      templeGym: membership.templeGym!,
      templeGymJunior: membership.templeGymJunior!,
      templeRun: membership.templeRun!,
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
        emergencyContact,
        authorization,
        medic,
        isAdult,
      }),
    });

    return sended;
  }
}
