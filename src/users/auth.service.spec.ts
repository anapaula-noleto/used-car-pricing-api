import {
  BadRequestException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create a fake copy of the user service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 99999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it("should create an instance of auth service", async () => {
    expect(service).toBeDefined();
  });

  it("creates a new user with a salted and hashed password", async () => {
    const user = await service.register("teste@gmail.com", "teste123");
    expect(user.password).not.toEqual("teste123");
    const [salt, hash] = user.password.split(".");
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("should throw an error if user signs up with email that is in use", async () => {
    await service.register("ab", "2786682");
    const registerPromise = service.register("ab", "278382");
    await expect(registerPromise).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw an error if the signin is called with unused email", async () => {
    const authenticationPromise = service.authenticate(
      "ajfh@dhfia.com",
      "adfdf",
    );
    await expect(authenticationPromise).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
  });

  it("should throw an error if an invalid password is provided", async () => {
    await service.register("fhdk@ddfd.com", "adfdfafd");
    const promise = service.authenticate("fhdk@ddfd.com", "password");
    await expect(promise).rejects.toBeInstanceOf(UnprocessableEntityException);
  });

  it("should return an user if correct password is provided", async () => {
    await service.register("teste@teste.com", "aaabbb");
    const user = await service.authenticate("teste@teste.com", "aaabbb");
    expect(user).toBeDefined;
  });
});
