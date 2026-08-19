import { NextResponse } from "next/server";
import { getSession, getGithubToken } from "@/lib/auth/session";
import { fetchUserRepos, fetchRepoLanguages } from "@/lib/github/repos";
import { prisma } from "@/lib/db";

/**
 * GET /api/repos - Fetch and sync user's GitHub repositories
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = await getGithubToken();
    if (!token) {
      return NextResponse.json({ error: "No GitHub token" }, { status: 401 });
    }

    // Fetch repos from GitHub
    const githubRepos = await fetchUserRepos(token);

    // Sync to database
    const userId = (session.user as any).id;
    const syncedRepos = [];

    for (const repo of githubRepos.slice(0, 50)) { // Limit to 50 repos
      const languages = await fetchRepoLanguages(token, repo.full_name.split("/")[0], repo.name)
        .catch(() => ({}));

      const syncedRepo = await prisma.userRepo.upsert({
        where: {
          userId_githubRepoId: {
            userId,
            githubRepoId: repo.id,
          },
        },
        update: {
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          languages,
          topics: repo.topics,
          starsCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          lastPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        },
        create: {
          userId,
          githubRepoId: repo.id,
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          url: repo.html_url,
          language: repo.language,
          languages,
          topics: repo.topics,
          starsCount: repo.stargazers_count,
          forksCount: repo.forks_count,
          lastPushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
        },
      });

      syncedRepos.push(syncedRepo);
    }

    return NextResponse.json({
      repos: syncedRepos,
      total: syncedRepos.length,
    });
  } catch (error) {
    console.error("Error fetching repos:", error);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}
