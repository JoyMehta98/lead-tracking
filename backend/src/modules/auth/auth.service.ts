import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UsersEntity } from "src/modules/users/users.entity";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "src/constants/messages.constants";
import CryptoJS from "crypto-js";
import { SignupDto, LoginDto } from "./auth.dto";
import { AuthHelperService } from "./auth.helper.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private readonly authHelper: AuthHelperService,
  ) {}

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password).toString();
  }

  async signup(dto: SignupDto) {
    const existing = await this.usersRepository.createQueryBuilder("user").where({ email: dto.email }).getOne();
    if (existing) throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS_ACCOUNT);

    const user = this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      password: this.hashPassword(dto.password),
    });
    const saved = await this.usersRepository.save(user);

    const authToken = this.authHelper.jwtSign({ id: saved.id }, "1h");
    const refreshToken = this.authHelper.jwtSign({ id: this.authHelper.encryptData(saved.id) }, "7d");

    return {
      message: SUCCESS_MESSAGES.CREATED,
      authToken,
      refreshToken,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .select(["user.id", "user.password", "user.email", "user.name"]) // need password for validation
      .where("user.email = :email", { email: dto.email })
      .getOne();

    if (!user) throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);

    const hashed = this.hashPassword(dto.password);
    if (user.password !== hashed) throw new UnauthorizedException(ERROR_MESSAGES.UNAUTHORIZED);

    const authToken = this.authHelper.jwtSign({ id: user.id }, "1h");
    const refreshToken = this.authHelper.jwtSign({ id: this.authHelper.encryptData(user.id) }, "7d");

    return {
      message: SUCCESS_MESSAGES.SUCCESS,
      authToken,
      refreshToken,
    };
  }
}
