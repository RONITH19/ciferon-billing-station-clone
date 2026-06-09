import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // better-sqlite3 is a native module; keep it out of the bundler.
  serverExternalPackages: ['better-sqlite3'],
  // Pin the tracing root to this app (a lockfile also exists in the parent folder).
  outputFileTracingRoot: path.resolve('.'),
};

export default nextConfig;
