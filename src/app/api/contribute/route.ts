import { NextRequest, NextResponse } from "next/server";
import { getSession, getGithubToken } from "@/lib/auth/session";
import { generateContributionCode } from "@/lib/ai/analyze";
import { fetchRepoIssues } from "@/lib/github/repos";
import { createPullRequest, forkRepository } from "@/lib/github/pr";
import { prisma } from "@/lib/db";

/**
 * POST /api/contribute - Generate code and create PR for a contribution
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const token = await getGithubToken();

    if (!token) {
      return NextResponse.json({ error: "No GitHub token" }, { status: 401 });
    }

    const body = await request.json();
    const { contributionId, action } = body;

    if (action === "generate") {
      // Get contribution details
      const contribution = await prisma.contribution.findUnique({
        where: { id: contributionId },
      });

      if (!contribution) {
        return NextResponse.json(
          { error: "Contribution not found" },
          { status: 404 }
        );
      }

      // Generate code using AI
      const codeResult = await generateContributionCode(
        userId,
        {
          title: contribution.issueTitle || "",
          body: contribution.issueBody || "",
        },
        [], // TODO: Fetch relevant files from GitHub
        {
          languages: {},
          topics: [],
        }
      );

      // Store the generated code
      await prisma.contribution.update({
        where: { id: contributionId },
        data: {
          status: "coding",
          suggestedApproach: codeResult.suggested_approach,
        },
      });

      return NextResponse.json({ codeResult });
    }

    if (action === "submit") {
      // Submit the PR to GitHub
      const { contributionId: id, branchName } = body;

      const contribution = await prisma.contribution.findUnique({
        where: { id },
      });

      if (!contribution) {
        return NextResponse.json(
          { error: "Contribution not found" },
          { status: 404 }
        );
      }

      // Fork the repository
      const fork = await forkRepository(
        token,
        contribution.targetRepoOwner,
        contribution.targetRepoName
      );

      // Create the PR
      const pr = await createPullRequest(token, {
        owner: contribution.targetRepoOwner,
        repo: contribution.targetRepoName,
        title: `feat: ${contribution.issueTitle}`,
        body: `## Changes\n\nCloses #${contribution.issueNumber}\n\n## Description\n\nAutomated contribution by OSS Contributor Agent.`,
        head: `${fork.owner.login}:${branchName}`,
        base: "main",
        files: [], // TODO: Get generated code files
      });

      // Store PR record
      const pullRequest = await prisma.pullRequest.create({
        data: {
          userId,
          contributionId: id,
          githubPrNumber: pr.number,
          githubPrUrl: pr.html_url,
          githubPrId: pr.id,
          title: pr.title,
          body: pr.body || "",
          branchName,
          status: "submitted",
        },
      });

      // Update contribution status
      await prisma.contribution.update({
        where: { id },
        data: { status: "pr_created" },
      });

      return NextResponse.json({ pullRequest, prUrl: pr.html_url });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error during contribution:", error);
    return NextResponse.json(
      { error: "Contribution failed" },
      { status: 500 }
    );
  }
}
