import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe('Get balance', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, usersRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to get user informations', async () => {
    const user = await createUserUseCase.execute({
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    });

    const balance = await inMemoryStatementsRepository.getUserBalance({ user_id: user.id!, with_statement: true });

    expect(balance).toHaveProperty('balance');
    expect(balance).toHaveProperty('statement');
  });

  it('should not be able to get user informations from non existent user', async () => {

    expect(async () => {

      await inMemoryStatementsRepository.getUserBalance({ user_id: 'testeID', with_statement: true });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
