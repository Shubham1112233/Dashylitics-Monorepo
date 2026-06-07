import path from 'path';
import { config } from 'dotenv';
import type { NextConfig } from 'next';

config({ path: path.join(__dirname, '../../.env') });
config({ path: path.join(__dirname, '../../.env.local'), override: true });

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', 'prisma', '@prisma/client'],
};

export default nextConfig;
