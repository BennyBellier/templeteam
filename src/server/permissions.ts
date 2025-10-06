import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
  members: ["read", "create", "update", "delete"],
  treasury: ["read", "create", "update", "delete"],
  secretary: ["read", "create", "update", "delete"],
  user: ["ban", "createUser"],
} as const;

export const ac = createAccessControl(statements);

export const developerRole = ac.newRole({
  ...adminAc.statements,
  members: ["read", "create", "update", "delete"],
  treasury: ["read", "create", "update", "delete"],
  secretary: ["read", "create", "update", "delete"],
  user: ["ban", "createUser"],
});

export const presidentRole = ac.newRole({
  ...adminAc.statements,
  members: ["read", "create", "update", "delete"],
  treasury: ["read", "create", "update", "delete"],
  secretary: ["read", "create", "update", "delete"],
  user: ["ban", "createUser"],
});

export const treasurerRole = ac.newRole({
  members: ["read", "create", "update", "delete"],
  treasury: ["read", "create", "update", "delete"],
});

export const secretaryRole = ac.newRole({
  members: ["read", "create", "update", "delete"],
  secretary: ["read", "create", "update", "delete"],
});

export const memberRole = ac.newRole({
  members: ["read"],
});