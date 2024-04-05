/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  compiler: {
    styledComponents: true,
  },

  // Required on webserver
  experimental: {
    workerThreads: true,
    cpus: 4,
  },
};

export default config;
