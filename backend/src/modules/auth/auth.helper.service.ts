import { JwtPayload, sign, verify } from "jsonwebtoken";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { secretConfig } from "src/config/secret.config";
import { AES, enc } from "crypto-js";
import { ERROR_MESSAGES } from "src/constants/messages.constants";

export class AuthHelperService {
  jwtSign(payload: object, expiresIn = secretConfig.jwtExpirationTime): string {
    return sign(payload, secretConfig.jwtSecretKey, {
      expiresIn,
    });
  }

  verifyToken(token: string): JwtPayload {
    try {
      return <JwtPayload>verify(token, secretConfig.jwtSecretKey);
    } catch (e) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }
  }

  decodeToken(authToken: string): { id: string } {
    if (!authToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id } = this.verifyToken(authToken);

    return { id };
  }

  refreshToken(refreshToken: string | undefined): string {
    if (!refreshToken) {
      throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const { id: encryptedUserId } = this.verifyToken(refreshToken);

    const bytes = AES.decrypt(encryptedUserId, secretConfig.aesEncryptionKey);
    const userId = bytes.toString(enc.Utf8);

    const token = this.jwtSign({
      id: userId.toString(),
      expiresIn: "1h",
    });

    return token;
  }

  encryptData(data: string): string {
    const encryptedData = AES.encrypt(data, secretConfig.aesEncryptionKey).toString();

    return encryptedData;
  }

  validateGuardRequest(authToken: string): { id: string } {
    const data = this.decodeToken(authToken);

    return data;
  }
}
