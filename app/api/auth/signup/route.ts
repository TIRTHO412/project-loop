import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { db, demoUsers, demoOrganizations, demoMemberships } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, companyName, email, password } = body;

    // 1. Validation
    if (!name || !companyName || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required (Name, Organization Name, Email, Password)." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid work email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    const slug = companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    let userId = "";
    let orgId = "";

    try {
      // Check existing email in DB
      const existingUser = await db.user.findUnique({
        where: { email: cleanEmail },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }

      // Create Organization
      const org = await db.organization.create({
        data: {
          name: companyName,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
        },
      });

      // Create User
      const user = await db.user.create({
        data: {
          name,
          email: cleanEmail,
          passwordHash,
          organizationId: org.id,
          role: Role.ADMIN,
        },
      });

      // Create Membership (First user is ADMIN)
      await db.membership.create({
        data: {
          userId: user.id,
          organizationId: org.id,
          role: Role.ADMIN,
        },
      });

      userId = user.id;
      orgId = org.id;
    } catch (dbError) {
      // Fallback in-memory storage if live database is unavailable
      const existingDemo = demoUsers.find((u) => u.email === cleanEmail);
      if (existingDemo) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        );
      }

      orgId = `org-${Date.now()}`;
      userId = `usr-${Date.now()}`;

      demoOrganizations.push({
        id: orgId,
        name: companyName,
        slug,
        plan: "PRO",
        createdAt: new Date().toISOString(),
      });

      demoUsers.push({
        id: userId,
        name,
        email: cleanEmail,
        passwordHash,
        organizationId: orgId,
        role: Role.ADMIN,
        createdAt: new Date().toISOString(),
      });

      demoMemberships.push({
        id: `mem-${Date.now()}`,
        userId,
        organizationId: orgId,
        role: Role.ADMIN,
        createdAt: new Date().toISOString(),
      });
    }

    // Set authenticated session cookie
    await setSessionCookie({
      userId,
      email: cleanEmail,
      name,
      organizationId: orgId,
      organizationName: companyName,
      organizationSlug: slug,
      role: Role.ADMIN,
    });

    return NextResponse.json({
      success: true,
      user: { id: userId, name, email: cleanEmail, role: Role.ADMIN },
      organization: { id: orgId, name: companyName, slug },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during registration." },
      { status: 500 }
    );
  }
}
