import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { randomBytes, scrypt as _scrypt } from "crypto";
import { promisify } from "util";
// Make sure that scrypt return a promisse of a password instead of using callbacks
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(email: string, password: string) {
    // See if email is in use
    const emailExists = await this.usersService.find(email);
    if (emailExists.length) {
      throw new BadRequestException("Email in use.");
    }
    // hash the password
    const hash = await this.hashPassword(password);
    // Store the new user record
    const user = await this.usersService.create(email, hash);
    // Return the user. The cookie will be setted up in the controller
    return user;
  }
  async authenticate(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user)
      throw new UnprocessableEntityException("Invalid email or password.");
    const [salt, storedHash] = user.password.split(".");
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (hash.toString("hex") !== storedHash) {
      throw new UnprocessableEntityException("Invalid email or password.");
    }
    return user;
  }
  private async hashPassword(password: string) {
    // Encrypt the user's password
    // Generate a salt
    const salt = randomBytes(8).toString("hex");
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + "." + hash.toString("hex");
    return result;
  }
}
