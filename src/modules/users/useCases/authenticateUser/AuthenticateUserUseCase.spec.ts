import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('authentica a user', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
  });

  it('should be able to authenticate user', async () => {
    const user: ICreateUserDTO = {
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    }

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute(user);

    expect(result).toHaveProperty('token');
  });

  it('should be able to authenticate non-existing user', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "email@teste.com",
        name: "teste",
        password: "1234",
      }
      await createUserUseCase.execute(user);
      await authenticateUserUseCase.execute({
        email: "email@teste.com",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('should not be able to authenticate email with wrong password', async () => {
    expect(async () => {
      const user = {
        email: "email@teste.com",
        name: "teste",
        password: "1234",
      }

      await authenticateUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
})
