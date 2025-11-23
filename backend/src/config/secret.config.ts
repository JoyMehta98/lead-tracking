import { getOsEnv } from "./env.config";

export const secretConfig = {
  jwtSecretKey: getOsEnv("JWT_SECRET_KEY"),
  jwtExpirationTime: getOsEnv("JWT_EXPIRATION_TIME"),
  aesEncryptionKey: getOsEnv("AES_ENCRYPTION_KEY"),
};
