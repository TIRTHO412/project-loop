import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, demoUsers, demoOrganizations, demoMemberships } from "@/lib/db";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, isDemoMode } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Direct Quick Demo Mode override
    if (isDemoMode) {
      const demoUser = demoUsers.find((u) => u.email === cleanEmail) || demoUsers[0];
      const demoOrg = demoOrganizations.find((o) => o.id === demoUser.organizationId) || demoOrganizations[0];

      await setSessionCookie({
        userId: demoUser.id,
        email: demoUser.email,
        name: demoUser.name,
        organizationId: demoOrg.id,
        organizationName: demoOrg.name,
        organizationSlug: demoOrg.slug,
        role: demoUser.role,
      });

      return NextResponse.json({
        success: true,
        user: { id: demoUser.id, name: demoUser.name, email: demoUser.email, role: demoUser.role },
        organization: { id: demoOrg.id, name: demoOrg.name, slug: demoOrg.slug },
      });
    }

    let foundUser = null;
    let foundOrg = null;

    try {
      // Check database
      const user = await db.user.findUnique({
        where: { email: cleanEmail },
        include: { organization: true, memberships: true },
      });

      if (user) {
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (passwordMatch) {
          foundUser = user;
          foundOrg = user.organization;
        }
      }
    } catch (e) {
      // Fallback check against in-memory demo users
    }

    if (!foundUser) {
      const demoMatch = demoUsers.find((u) => u.email === cleanEmail);
      if (demoMatch) {
        // Accept demo password "Password123!" or any matching input for demo accounts
        if (password === "Password123!" || password.length >= 6) {
          foundUser = demoMatch;
          foundOrg = demoOrganizations.find((o) => o.id === demoMatch.organizationId) || demoOrganizations[0];
        }
      }
    }

    if (!foundUser || !foundOrg) {
      // Generic error message to prevent account enumeration
      return NextResponse.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: foundUser.id,
      email: foundUser.email,
      name: foundUser.name,
      organizationId: foundOrg.id,
      organizationName: foundOrg.name,
      organizationSlug: foundOrg.slug,
      role: foundUser.role,
    });

    return NextResponse.json({
      success: true,
      user: { id: foundUser.id, name: foundUser.name, email: foundUser.email, role: foundUser.role },
      organization: { id: foundOrg.id, name: foundOrg.name, slug: foundOrg.slug },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}
