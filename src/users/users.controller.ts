import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  HttpCode,
  Session,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./decorators/current-user.decorator";
import { User } from "./user.entity";

@Controller()
@Serialize(UserDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post("auth/signup")
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post("auth/signin")
  @HttpCode(200)
  async authenticateUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.authenticate(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get("/whoami")
  // whoAmI(@Session() session: any) {
  //   console.log(session.userId);
  //   return this.usersService.findOneById(session.userId);
  // }
  @Get("/whoami")
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post("/auth/signout")
  @HttpCode(200)
  signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get("users/:id")
  findUser(@Param("id") id: string) {
    return this.usersService.findOneById(Number(id));
  }

  @Serialize(UserDto)
  @Get("users")
  findAllUsers(@Query("email") email: string) {
    return this.usersService.find(email);
  }

  @Delete("users/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }

  @Patch("users/:id")
  updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(Number(id), body);
  }
}
