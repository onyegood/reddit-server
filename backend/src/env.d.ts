declare namespace NodeJS {
  interface ProcessEnv {
    SESSION_SECRET_KEY: string;
    DATABASE_URL: string;
    REDIS_URL: string;
    PORT: string;
    CORS_ORIGIN: string;
  }
}