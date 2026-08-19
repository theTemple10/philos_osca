import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export function createGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

export function createGitHubClientForApp() {
  // For app-level operations (searching repos, etc.)
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_PRIVATE_KEY;
  const installationId = process.env.GITHUB_INSTALLATION_ID;

  if (!appId || !privateKey || !installationId) {
    throw new Error("GitHub App credentials not configured");
  }

  return new Octokit({
    auth: createAppAuth({
      appId: parseInt(appId),
      privateKey,
      installationId: parseInt(installationId),
    }),
  });
}
