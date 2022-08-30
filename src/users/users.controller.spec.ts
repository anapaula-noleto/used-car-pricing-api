import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";

describe("UsersController", () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOneById: (id: number) => {
        return Promise.resolve({
          id,
          email: "teste@teste.com",
          password: "sadfadd",
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: "adfdfdasf" } as User,
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };
    fakeAuthService = {
      // register: () => {},
      authenticate: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("findAllUsers should return a list of users with the given email", async () => {
    const users = await controller.findAllUsers("asdf@asdf.com");
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual("asdf@asdf.com");
  });

  it("findUser should return a single user with a given id", async () => {
    const user = await controller.findUser("34");
    expect(user).toBeDefined();
  });

  it("signin/authetication updates session object and returns use user", async () => {
    const session = { userId: 231231312 };
    const user = await controller.authenticateUser(
      {
        email: "asdf@asdf.com",
        password: "asdf",
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
