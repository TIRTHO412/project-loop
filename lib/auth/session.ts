import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { db, demoUsers, demoOrganizations, demoMemberships } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "project-loop-secure-auth-secret-key-min-32-chars"
);

export const COOKIE_NAME = "loop_session";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  organizationId: string;
  organizationName: string;
  organizationSlug: string;
  role: Role;
}

/**
 * Encrypt and create session token
 */
export async function encryptSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Decrypt session token
 */
export async function decryptSession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Create HTTP-only session cookie
 */
export async function setSessionCookie(payload: SessionPayload) {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

/**
 * Helper to construct an authenticated NextResponse with Set-Cookie header
 */
export async function createAuthResponse(payload: SessionPayload, bodyData: any, status = 200) {
  const token = await encryptSession(payload);
  const response = NextResponse.json(bodyData, { status });

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });

  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (e) {
    // Read-only cookieStore fallback
  }

  return response;
}

/**
 * Invalidate session cookie (Logout)
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

/**
 * Get current session payload
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return await decryptSession(token);
}

/**
 * Server-side Authorization Helper: Require Authenticated Session
 */
export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Server-side Authorization Helper: Require specific RBAC Role
 */
export async function requireRole(allowedRoles: Role[]): Promise<SessionPayload> {
  const session = await requireAuth();
  if (!allowedRoles.includes(session.role)) {
    throw new Error("FORBIDDEN");
  }
  return session;
}

/**
 * Server-side Helper: Get Current User details
 */
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        organizationId: true,
        role: true,
        createdAt: true,
      },
    });
    if (user) return user;
  } catch (e) {
    // Database fallback to demo record if DB connection unavailable
  }

  const demoUser = demoUsers.find((u) => u.id === session.userId || u.email === session.email);
  if (demoUser) {
    const { passwordHash, ...safeUser } = demoUser;
    return safeUser;
  }

  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    organizationId: session.organizationId,
    role: session.role,
  };
}

/**
 * Server-side Helper: Get Current Organization details (Multi-tenant scoped)
 */
export async function getCurrentOrganization() {
  const session = await getSession();
  if (!session) return null;

  try {
    const org = await db.organization.findUnique({
      where: { id: session.organizationId },
    });
    if (org) return org;
  } catch (e) {
    // DB fallback
  }

  const demoOrg = demoOrganizations.find(
    (o) => o.id === session.organizationId || o.slug === session.organizationSlug
  );
  if (demoOrg) return demoOrg;

  return {
    id: session.organizationId,
    name: session.organizationName,
    slug: session.organizationSlug,
    plan: "PRO",
  };
}

/**
 * Server-side Helper: Get Current User Membership & Scoped Permissions
 */
export async function getCurrentMembership() {
  const session = await getSession();
  if (!session) return null;

  try {
    const membership = await db.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.userId,
          organizationId: session.organizationId,
        },
      },
    });
    if (membership) return membership;
  } catch (e) {
    // DB fallback
  }

  const demoMem = demoMemberships.find(
    (m) => m.userId === session.userId && m.organizationId === session.organizationId
  );
  if (demoMem) return demoMem;

  return {
    id: `mem-${session.userId}`,
    userId: session.userId,
    organizationId: session.organizationId,
    role: session.role,
  };
}
