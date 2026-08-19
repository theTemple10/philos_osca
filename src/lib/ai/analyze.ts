import { generateText } from "ai";
import { getAIProvider, getDefaultProvider } from "./providers";
import {
  analyzeUserSkillsPrompt,
  analyzeContributionPrompt,
  generateCodePrompt,
  findMatchingReposPrompt,
} from "./prompts";
import { prisma } from "@/lib/db";

/**
 * Analyze a user's repositories to build a skill profile
 */
export async function analyzeUserSkills(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { repositories: true },
  });

  if (!user || !user.accessToken) {
    throw new Error("User not found or no GitHub access token");
  }

  const providerConfig = getDefaultProvider(
    user.preferredAiProvider,
    user.preferredAiModel
  );

  const prompt = analyzeUserSkillsPrompt(
    user.repositories.map((repo) => ({
      name: repo.name,
      language: repo.language,
      languages: repo.languages as Record<string, number> || null,
      topics: (repo.topics as string[]) || [],
      description: repo.description,
      starsCount: repo.starsCount,
    }))
  );

  const { text } = await generateText({
    model: getAIProvider(providerConfig),
    prompt,
    temperature: 0.3,
  });

  const skillProfile = JSON.parse(text);

  // Update user's skill profile
  await prisma.user.update({
    where: { id: userId },
    data: { skillProfile },
  });

  return skillProfile;
}

/**
 * Analyze a contribution opportunity
 */
export async function analyzeContribution(
  userId: string,
  issue: { title: string; body: string; labels: string[] },
  repoContext: { languages: Record<string, number>; topics: string[]; description: string }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const providerConfig = getDefaultProvider(
    user.preferredAiProvider,
    user.preferredAiModel
  );

  const prompt = analyzeContributionPrompt(
    issue,
    user.skillProfile,
    repoContext
  );

  const { text } = await generateText({
    model: getAIProvider(providerConfig),
    prompt,
    temperature: 0.2,
  });

  return JSON.parse(text);
}

/**
 * Generate code for a contribution
 */
export async function generateContributionCode(
  userId: string,
  issue: { title: string; body: string },
  relevantFiles: Array<{ path: string; content: string }>,
  repoContext: {
    languages: Record<string, number>;
    topics: string[];
    conventions?: string;
  }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const providerConfig = getDefaultProvider(
    user.preferredAiProvider,
    user.preferredAiModel
  );

  const prompt = generateCodePrompt(issue, relevantFiles, repoContext);

  const { text } = await generateText({
    model: getAIProvider(providerConfig),
    prompt,
    temperature: 0.4,
    maxTokens: 8000,
  });

  return JSON.parse(text);
}

/**
 * Find matching repositories for a user
 */
export async function findMatchingRepositories(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  const providerConfig = getDefaultProvider(
    user.preferredAiProvider,
    user.preferredAiModel
  );

  const prompt = findMatchingReposPrompt(user.skillProfile, {
    difficulty: user.difficultyLevel || undefined,
  });

  const { text } = await generateText({
    model: getAIProvider(providerConfig),
    prompt,
    temperature: 0.3,
  });

  return JSON.parse(text);
}
