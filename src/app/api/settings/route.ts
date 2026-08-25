import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: {
        preferredAiProvider: true,
        preferredAiModel: true,
        difficultyLevel: true,
      },
    });

    return NextResponse.json({
      aiProvider: user?.preferredAiProvider || "openai",
      aiModel: user?.preferredAiModel || "gpt-4o",
      difficulty: user?.difficultyLevel || "adaptive",
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { aiProvider, aiModel, difficulty } = body;

    await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        ...(aiProvider && { preferredAiProvider: aiProvider }),
        ...(aiModel && { preferredAiModel: aiModel }),
        ...(difficulty && { difficultyLevel: difficulty }),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
