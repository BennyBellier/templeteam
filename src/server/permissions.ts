import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  members: ["read", "manage"],
  treasury: ["read", "manage"],
  secretary: ["read", "manage"],
  user: ["ban", "createUser"],
} as const;

export const ac = createAccessControl(statements);

export const developerRole = ac.newRole({
  ...adminAc.statements,
  members: ["read", "manage"],
  treasury: ["read", "manage"],
  secretary: ["read", "manage"],
  user: ["ban", "createUser"],
});

export const presidentRole = ac.newRole({
  ...adminAc.statements,
  members: ["read", "manage"],
  treasury: ["read", "manage"],
  secretary: ["read", "manage"],
  user: ["ban", "createUser"],
});

export const treasurerRole = ac.newRole({
  members: ["read", "manage"],
  treasury: ["read", "manage"],
});

export const secretaryRole = ac.newRole({
  members: ["read", "manage"],
  secretary: ["read", "manage"],
});

export const memberRole = ac.newRole({
  members: ["read"],
});