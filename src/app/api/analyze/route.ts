import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { analyzeUserSkills, analyzeContribution } from "@/lib/ai/analyze";
import { prisma } from "@/lib/db";

/**
 * POST /api/analyze - Analyze user skills from their repos
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    if (body.type === "skills") {
      const skillProfile = await analyzeUserSkills(userId);
      return NextResponse.json({ skillProfile });
    }

    if (body.type === "contribution") {
      const { issue, repoContext } = body;
      const analysis = await analyzeContribution(userId, issue, repoContext);
      return NextResponse.json({ analysis });
    }

    return NextResponse.json({ error: "Invalid analysis type" }, { status: 400 });
  } catch (error) {
    console.error("Error during analysis:", error);
    return NextResponse.json(
      { error: "Analysis failed" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze - Get existing skill profile
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { skillProfile: true },
    });

    return NextResponse.json({ skillProfile: user?.skillProfile });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch skill profile" },
      { status: 500 }
    );
  }
}
