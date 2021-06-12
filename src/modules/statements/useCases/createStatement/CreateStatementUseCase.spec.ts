import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase";
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe('Deposit statement', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });


  it('should be to deposit amount', async () => {
    const user = await createUserUseCase.execute({
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    });

    const statementOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit amount'
    });

    expect(statementOperation.amount).toBe(10);
    expect(statementOperation.type).toBe(OperationType.DEPOSIT)
  });

  it('should be to withdraw amount', async () => {
    const user = await createUserUseCase.execute({
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    });

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit amount'
    });

    const withdrawOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.WITHDRAW,
      amount: 5,
      description: 'withdrw amount'
    });

    expect(withdrawOperation.amount).toBe(5);
    expect(withdrawOperation.type).toBe(OperationType.WITHDRAW)
  });

  it('should be to deposit amount', () => {

    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'non existent user',
        type: OperationType.DEPOSIT,
        amount: 10,
        description: 'deposit amount'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('should not be able to withdraw amount greater than balance', () => {

    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "email@teste.com",
        name: "teste",
        password: "1234",
      });

      await createStatementUseCase.execute({
        user_id: user.id!,
        type: OperationType.WITHDRAW,
        amount: 10,
        description: 'withdraw amount'
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
})
