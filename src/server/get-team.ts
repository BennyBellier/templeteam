import { prisma } from "@/trpc/server";
import type {
  TeamMembers,
  TeamMembersSkill,
  TeamMembersVideo,
} from "@prisma/client";
import { cache } from "react";
import "server-only";

export const preloadTeamMembers = () => {
  void getTeamMembers();
};

type TeamMembersDB = {
  videos: TeamMembersVideo[];
  skills: TeamMembersSkill[];
} & TeamMembers;

export const getTeamMembers = cache(async () => {
  const members = await prisma.teamMembers.get();
  const teamMembers = members.map((member: TeamMembersDB) => ({
    ...member,
    videos: member.videos.map((video: TeamMembersVideo) => video.path),
  }));

  return teamMembers;
});
