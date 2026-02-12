export const envValidation = () => {
  const requiredVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'REFRESH_SECRET',
    'NODE_ENV',
  ];

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`);
  }

  return {
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    refreshSecret: process.env.REFRESH_SECRET,
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 3001,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  };
};
