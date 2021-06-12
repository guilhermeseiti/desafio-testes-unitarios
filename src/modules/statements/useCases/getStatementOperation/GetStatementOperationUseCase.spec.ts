import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Get statement operation', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, inMemoryStatementsRepository);
    createUserUseCase = new CreateUserUseCase(usersRepository);
  });

  it('should be able to get operation informations', async () => {
    const user = await createUserUseCase.execute({
      email: "email@teste.com",
      name: "teste",
      password: "1234",
    });

    const depositOperation = await createStatementUseCase.execute({
      user_id: user.id!,
      type: OperationType.DEPOSIT,
      amount: 10,
      description: 'deposit amount'
    });

    const statementOperation = await getStatementOperationUseCase.execute({ user_id: user.id!, statement_id: depositOperation.id! });

    expect(statementOperation.description).toBe('deposit amount');
  });

  it('should not be able to get operation informations from non existent user', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        email: "email@teste.com",
        name: "teste",
        password: "1234",
      });

      const depositOperation = await createStatementUseCase.execute({
        user_id: 'id-abc',
        type: OperationType.DEPOSIT,
        amount: 10,
        description: 'deposit amount'
      });

      await getStatementOperationUseCase.execute({ user_id: 'id-abc', statement_id: depositOperation.id! });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not be able to get operation informations fromnon existent statement', async () => {
    expect(async () => {
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

      await getStatementOperationUseCase.execute({ user_id: user.id!, statement_id: 'non-exist-statement' });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

})
