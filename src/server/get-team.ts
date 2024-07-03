import { prisma } from "@/trpc/server";
import type {
  TeamMembers,
  TeamMembersSkill,
  TeamMembersVideo,
} from "@prisma/client";
import { cache } from "react";
import "server-only";
import { logger } from "./logger";

export const preloadTeamMembers = () => {
  void getTeamMembers();
};

type TeamMembersDB = {
  videos: TeamMembersVideo[];
  skills: TeamMembersSkill[];
} & TeamMembers;

export const getTeamMembers = cache(async () => {
  try {
    // const members = await prisma.teamMembers.get();
    /* const teamMembers = members.map((member: TeamMembersDB) => ({
      ...member,
      videos: member.videos.map((video: TeamMembersVideo) => video.path),
    })); */

    const members = "Google IDX - prisma deactivated"

    logger.debug("getTeamMembers: ", members);
    // return teamMembers;
    return members
  } catch (error) {
    logger.error(error);
  }
  return [];
});
