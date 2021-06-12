import exp from "node:constants";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show user profile', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
  });

  it('should be able to show user profile', async () => {
    const user = {
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    };

    const userCreated = await createUserUseCase.execute(user);
    const result = await showUserProfileUseCase.execute(userCreated.id!);

    expect(result).toHaveProperty('id');
  });

  it('should not be able to show non-existing user', async () => {
    expect(async () => {
      const user = {
        email: "email@teste.com",
        name: "teste",
        password: "1234",
      };

      await createUserUseCase.execute(user);
      await showUserProfileUseCase.execute('dasdsadsa');
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
