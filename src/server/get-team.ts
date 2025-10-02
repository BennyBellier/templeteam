import "server-only";

import { prisma } from "@/trpc/server";
import type {
  TeamMembers,
  TeamMembersSkill,
  TeamMembersVideo,
} from "@prisma/client";
import { cache } from "react";
import logger from "./logger";

export const preloadTeamMembers = () => {
  void getTeamMembers();
};

type TeamMembersDB = {
  videos: TeamMembersVideo[];
  skills: TeamMembersSkill[];
} & TeamMembers;

export const getTeamMembers = cache(async () => {
  try {
    const members = await prisma.site.teamMembers.get();
    const teamMembers = members.map((member: TeamMembersDB) => ({
      ...member,
      videos: member.videos.map((video: TeamMembersVideo) => video.path),
    }));

    logger.debug({
      context: "NextCached",
      requestPath: "getTeamMembers",
      data: members,
      message: `Find ${members.length} members.`,
    });

    return teamMembers;
  } catch (error) {
    logger.error({
      context: "NextCached",
      requestPath: "cached.getTeamMembers",
      data: error,
      message: `Error while trying to fetch cached team members.`,
    });
  }
  return [];
});
