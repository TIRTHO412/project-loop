import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false, session: null }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    session: {
      userId: session.userId,
      name: session.name,
      email: session.email,
      organizationId: session.organizationId,
      organizationName: session.organizationName,
      organizationSlug: session.organizationSlug,
      role: session.role,
    },
  });
}
