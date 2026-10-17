// Build metadata is injected at image build time (see Dockerfile ARGs) so the
// running version can be traced back to a commit and a pipeline run.
export const buildInfo = {
  version: process.env.APP_VERSION ?? 'dev',
  commit: process.env.GIT_SHA ?? 'unknown',
  buildTime: process.env.BUILD_TIME ?? 'unknown',
  environment: process.env.APP_ENV ?? 'local',
} as const;
