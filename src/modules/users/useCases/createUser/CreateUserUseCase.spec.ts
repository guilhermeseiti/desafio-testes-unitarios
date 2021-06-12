import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from './CreateUserError';
import { CreateUserUseCase } from './CreateUserUseCase';

let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe('Create a new user', () => {

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it("should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("should be able to create a new user", async () => {
    expect(async () => {
      const user = {
        email: "email@teste.com",
        name: "teste",
        password: "1234",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
