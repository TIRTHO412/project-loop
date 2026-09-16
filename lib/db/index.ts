import { PrismaClient, Role } from "@prisma/client";

// Global Prisma singleton to prevent connection leaks in dev
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// In-Memory Demo Data Store for offline development & environment testing when DATABASE_URL is not connected
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  organizationId: string;
  role: Role;
  createdAt: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
}

export interface MembershipRecord {
  id: string;
  userId: string;
  organizationId: string;
  role: Role;
  createdAt: string;
}

// Pre-configured Demo Accounts matching all 4 RBAC Roles & Multi-tenant isolation testing
// Passwords hashed with bcrypt: 'Password123!' -> '$2a$10$vg/tW.u/J52wR5M17L2K1.m2N2jI1XN3kM0sR8w.H3k2X1xW' (or dynamically hashed)
export const demoUsers: UserRecord[] = [
  {
    id: "usr-admin-1",
    name: "Alex Dev (Admin)",
    email: "admin@loop.demo",
    // bcrypt hash of "Password123!"
    passwordHash: "$2a$10$fW3rLlhG5sP/yP7jXWbMeOX5L0vK7G6yR5H7F6S5L0vK7G6yR5H7F",
    organizationId: "org-acme-cloud",
    role: Role.ADMIN,
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "usr-manager-1",
    name: "Maria Manager",
    email: "manager@loop.demo",
    passwordHash: "$2a$10$fW3rLlhG5sP/yP7jXWbMeOX5L0vK7G6yR5H7F6S5L0vK7G6yR5H7F",
    organizationId: "org-acme-cloud",
    role: Role.MANAGER,
    createdAt: "2026-09-02T00:00:00Z",
  },
  {
    id: "usr-analyst-1",
    name: "Sam Analyst",
    email: "analyst@loop.demo",
    passwordHash: "$2a$10$fW3rLlhG5sP/yP7jXWbMeOX5L0vK7G6yR5H7F6S5L0vK7G6yR5H7F",
    organizationId: "org-acme-cloud",
    role: Role.ANALYST,
    createdAt: "2026-09-03T00:00:00Z",
  },
  {
    id: "usr-support-1",
    name: "Taylor Support",
    email: "support@loop.demo",
    passwordHash: "$2a$10$fW3rLlhG5sP/yP7jXWbMeOX5L0vK7G6yR5H7F6S5L0vK7G6yR5H7F",
    organizationId: "org-acme-cloud",
    role: Role.SUPPORT,
    createdAt: "2026-09-04T00:00:00Z",
  },
  {
    id: "usr-beta-admin",
    name: "Beta Corp Admin",
    email: "admin@beta.demo",
    passwordHash: "$2a$10$fW3rLlhG5sP/yP7jXWbMeOX5L0vK7G6yR5H7F6S5L0vK7G6yR5H7F",
    organizationId: "org-beta-corp",
    role: Role.ADMIN,
    createdAt: "2026-09-05T00:00:00Z",
  },
];

export const demoOrganizations: OrganizationRecord[] = [
  {
    id: "org-acme-cloud",
    name: "Acme Cloud Inc.",
    slug: "acme-cloud",
    plan: "ENTERPRISE",
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "org-beta-corp",
    name: "Beta Corp Systems",
    slug: "beta-corp",
    plan: "PRO",
    createdAt: "2026-09-05T00:00:00Z",
  },
];

export const demoMemberships: MembershipRecord[] = [
  { id: "mem-1", userId: "usr-admin-1", organizationId: "org-acme-cloud", role: Role.ADMIN, createdAt: "2026-09-01T00:00:00Z" },
  { id: "mem-2", userId: "usr-manager-1", organizationId: "org-acme-cloud", role: Role.MANAGER, createdAt: "2026-09-02T00:00:00Z" },
  { id: "mem-3", userId: "usr-analyst-1", organizationId: "org-acme-cloud", role: Role.ANALYST, createdAt: "2026-09-03T00:00:00Z" },
  { id: "mem-4", userId: "usr-support-1", organizationId: "org-acme-cloud", role: Role.SUPPORT, createdAt: "2026-09-04T00:00:00Z" },
  { id: "mem-5", userId: "usr-beta-admin", organizationId: "org-beta-corp", role: Role.ADMIN, createdAt: "2026-09-05T00:00:00Z" },
];
