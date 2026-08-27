require("dotenv").config();

const REQUIRED_KEYS = [
  "POSTGRES_CONNECTION_STRING",
  "PORT",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

function validateEnv(envSource) {
  const missing = REQUIRED_KEYS.filter((key) => !envSource[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}`,
    );
  }

  return {
    port: Number(envSource.PORT),
    dbConnectionString: envSource.POSTGRES_CONNECTION_STRING,
    corsOrigin: envSource.FRONTEND_ORIGIN || "http://localhost:5173",
    jwt: {
      accessSecret: envSource.JWT_ACCESS_SECRET,
      refreshSecret: envSource.JWT_REFRESH_SECRET,
      accessExpiresIn: envSource.JWT_ACCESS_EXPIRES_IN,
      refreshExpiresIn: envSource.JWT_REFRESH_EXPIRES_IN,
    },
  };
}

module.exports = { validateEnv, ...validateEnv(process.env) };
