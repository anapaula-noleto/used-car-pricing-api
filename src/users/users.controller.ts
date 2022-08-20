import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
} from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UsersService } from "./users.service";
import { Serialize } from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";

@Controller()
@Serialize(UserDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post("auth/signup")
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
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
